import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import { appointments as initialAppointments } from "@/data/appointments"
import { invoices as initialInvoices } from "@/data/invoices"
import { tickets as initialTickets } from "@/data/tickets"
import { prescriptions as initialPrescriptions } from "@/data/prescriptions"
import type {
  Appointment,
  AppointmentStatus,
  Invoice,
  Prescription,
  Ticket,
  TicketCategory,
  TicketStatus,
} from "@/types"

let idCounter = 1000
function nextId(prefix: string) {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

type NewAppointmentInput = {
  patientId: string
  patientName: string
  doctor: string
  department: string
  date: string
  time: string
  reason: string
}

type NewTicketInput = {
  patientId: string
  patientName: string
  subject: string
  category: TicketCategory
  message: string
}

type DataContextValue = {
  appointments: Appointment[]
  invoices: Invoice[]
  tickets: Ticket[]
  prescriptions: Prescription[]
  bookAppointment: (input: NewAppointmentInput) => Appointment
  setAppointmentStatus: (id: string, status: AppointmentStatus) => void
  payInvoice: (id: string) => void
  createTicket: (input: NewTicketInput) => Ticket
  replyToTicket: (
    ticketId: string,
    body: string,
    author: "patient" | "staff",
    authorName: string
  ) => void
  setTicketStatus: (ticketId: string, status: TicketStatus) => void
  requestRefill: (prescriptionId: string) => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions)

  const bookAppointment = useCallback((input: NewAppointmentInput) => {
    const appointment: Appointment = {
      id: nextId("a"),
      status: "confirmed",
      ...input,
    }
    setAppointments((prev) => [appointment, ...prev])
    return appointment
  }, [])

  const setAppointmentStatus = useCallback((id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    )
  }, [])

  const payInvoice = useCallback((id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "paid" } : inv))
    )
  }, [])

  const createTicket = useCallback((input: NewTicketInput) => {
    const now = new Date().toISOString()
    const ticket: Ticket = {
      id: nextId("t"),
      patientId: input.patientId,
      patientName: input.patientName,
      subject: input.subject,
      category: input.category,
      priority: "normal",
      status: "open",
      createdAt: now,
      updatedAt: now,
      messages: [
        {
          id: nextId("m"),
          author: "patient",
          authorName: input.patientName,
          body: input.message,
          timestamp: now,
        },
      ],
    }
    setTickets((prev) => [ticket, ...prev])
    return ticket
  }, [])

  const replyToTicket = useCallback(
    (ticketId: string, body: string, author: "patient" | "staff", authorName: string) => {
      const now = new Date().toISOString()
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                updatedAt: now,
                status: t.status === "open" && author === "staff" ? "in-progress" : t.status,
                messages: [
                  ...t.messages,
                  { id: nextId("m"), author, authorName, body, timestamp: now },
                ],
              }
            : t
        )
      )
    },
    []
  )

  const setTicketStatus = useCallback((ticketId: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t
      )
    )
  }, [])

  const requestRefill = useCallback((prescriptionId: string) => {
    setPrescriptions((prev) =>
      prev.map((p) =>
        p.id === prescriptionId ? { ...p, status: "refill-requested" } : p
      )
    )
  }, [])

  const value = useMemo(
    () => ({
      appointments,
      invoices,
      tickets,
      prescriptions,
      bookAppointment,
      setAppointmentStatus,
      payInvoice,
      createTicket,
      replyToTicket,
      setTicketStatus,
      requestRefill,
    }),
    [
      appointments,
      invoices,
      tickets,
      prescriptions,
      bookAppointment,
      setAppointmentStatus,
      payInvoice,
      createTicket,
      replyToTicket,
      setTicketStatus,
      requestRefill,
    ]
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData must be used within DataProvider")
  return ctx
}

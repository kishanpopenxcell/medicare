export type Role = "patient" | "staff"

export type User = {
  id: string
  name: string
  email: string
  role: Role
  patientId?: string
  avatarInitials: string
}

export type Patient = {
  id: string
  name: string
  email: string
  dob: string
  avatarInitials: string
}

export type ReportStatus = "final" | "pending-review"

export type LabValue = {
  label: string
  value: string
  range: string
  flag: "normal" | "low" | "high"
}

export type ReportAttachment = {
  name: string
  kind: "pdf" | "image"
  size: string
}

export type MedicalReport = {
  id: string
  patientId: string
  title: string
  type: string
  doctor: string
  facility: string
  date: string
  status: ReportStatus
  findings: string
  recommendation: string
  followUpDate?: string
  labValues?: LabValue[]
  attachments: ReportAttachment[]
}

export type PrescriptionStatus = "active" | "expired" | "refill-requested"

export type Prescription = {
  id: string
  patientId: string
  medicine: string
  dosage: string
  doctor: string
  date: string
  status: PrescriptionStatus
  instructions: string
  prescribedFor: string
  pharmacy: string
  refillsRemaining: number
  sideEffects: string[]
}

export type AppointmentStatus = "confirmed" | "pending" | "cancelled"

export type Appointment = {
  id: string
  patientId: string
  patientName: string
  doctor: string
  department: string
  date: string
  time: string
  reason: string
  status: AppointmentStatus
}

export type InvoiceStatus = "paid" | "unpaid" | "overdue"

export type InvoiceLineItem = {
  label: string
  amount: number
}

export type Invoice = {
  id: string
  patientId: string
  patientName: string
  date: string
  dueDate: string
  service: string
  doctor: string
  amount: number
  status: InvoiceStatus
  lineItems: InvoiceLineItem[]
  insuranceCovered: number
  paymentMethod?: string
  paidDate?: string
}

export type TicketStatus = "open" | "in-progress" | "resolved"
export type TicketCategory = "billing" | "medical" | "technical" | "other"
export type TicketPriority = "low" | "normal" | "high"

export type TicketMessage = {
  id: string
  author: "patient" | "staff"
  authorName: string
  body: string
  timestamp: string
}

export type Ticket = {
  id: string
  patientId: string
  patientName: string
  subject: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  assignedTo?: string
  createdAt: string
  updatedAt: string
  messages: TicketMessage[]
}

import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarDays, Clock, User, XCircle } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shell/page-header"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StatusDot } from "@/components/status-dot"
import { EmptyState } from "@/components/empty-state"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { useAuth } from "@/context/auth-context"
import { useData } from "@/context/data-context"
import { departments, doctorsByDepartment } from "@/data/appointments"
import { BookingFlow } from "@/components/booking-flow"
import type { AppointmentStatus } from "@/types"
import appointmentsEmpty from "@/assets/illustrations/appointments-empty.svg"

const STATUS_TONE: Record<AppointmentStatus, "success" | "warning" | "danger"> = {
  confirmed: "success",
  pending: "warning",
  cancelled: "danger",
}

function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default function AppointmentsPage() {
  const { user } = useAuth()
  const { appointments, setAppointmentStatus } = useData()
  const [params, setParams] = useSearchParams()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [bookingOpen, setBookingOpen] = useState(params.get("book") === "1")

  const isStaff = user?.role === "staff"

  const scoped = useMemo(
    () =>
      isStaff
        ? appointments
        : appointments.filter((a) => a.patientId === user?.patientId),
    [appointments, isStaff, user?.patientId]
  )

  const bookedDateKeys = useMemo(
    () => new Set(scoped.filter((a) => a.status !== "cancelled").map((a) => a.date)),
    [scoped]
  )

  const selectedKey = selectedDate ? toDateKey(selectedDate) : null
  const dayAppointments = selectedKey
    ? scoped.filter((a) => a.date === selectedKey).sort((a, b) => a.time.localeCompare(b.time))
    : []

  return (
    <div>
      <PageHeader
        icon={CalendarDays}
        title="Appointments"
        description={isStaff ? "Clinic-wide schedule across all patients." : "Your upcoming and past visits."}
      />

      {!isStaff && (
        <div className="mb-4 flex justify-end">
          <Button
            onClick={() => {
              setBookingOpen(true)
              setParams({})
            }}
          >
            Book appointment
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <div className="rounded-2xl border bg-card/50 p-3 shadow-sm">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-xl"
            modifiers={{ booked: (date) => bookedDateKeys.has(toDateKey(date)) }}
            modifiersClassNames={{ booked: "relative after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-primary" }}
          />
        </div>

        <div>
          <h3 className="mb-3 font-medium text-foreground">
            {selectedDate
              ? selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
              : "Select a date"}
          </h3>

          {!selectedDate ? (
            <EmptyState
              title="Pick a day on the calendar"
              description="Days with a dot underneath have scheduled appointments."
              illustration={<img src={appointmentsEmpty} alt="" className="h-48 w-64 object-contain" />}
            />
          ) : dayAppointments.length === 0 ? (
            <EmptyState
              title="No appointments this day"
              illustration={<img src={appointmentsEmpty} alt="" className="h-48 w-64 object-contain" />}
            />
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {dayAppointments.map((appt) => (
                  <motion.div
                    key={appt.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-between rounded-2xl border bg-card/50 p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Clock className="size-4.5" strokeWidth={2} />
                      </span>
                      <div>
                        <div className="font-medium text-foreground">
                          {appt.time} · {appt.department}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {isStaff ? (
                            <span className="inline-flex items-center gap-1">
                              <User className="size-3.5" /> {appt.patientName}
                            </span>
                          ) : (
                            appt.doctor
                          )}
                          {" · "}
                          {appt.reason}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusDot tone={STATUS_TONE[appt.status]} label={appt.status} />
                      {!isStaff && appt.status !== "cancelled" && (
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => {
                            setAppointmentStatus(appt.id, "cancelled")
                            toast.success("Appointment cancelled")
                          }}
                        >
                          <XCircle className="size-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <Sheet open={bookingOpen} onOpenChange={setBookingOpen}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Book an appointment</SheetTitle>
            <SheetDescription>Choose a department, doctor, and time.</SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-1 px-4">
            <div className="pb-4">
              <BookingFlow
                departments={departments}
                doctorsByDepartment={doctorsByDepartment}
                onDone={() => setBookingOpen(false)}
              />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}

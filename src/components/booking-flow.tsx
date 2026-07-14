import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/auth-context"
import { useData } from "@/context/data-context"
import { patients } from "@/data/patients"
import { cn } from "@/lib/utils"
import appointmentSuccess from "@/assets/illustrations/appointment-success.svg"

const STEPS = ["Department", "Time", "Confirm"] as const
const TIME_SLOTS = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"]

export function BookingFlow({
  departments,
  doctorsByDepartment,
  onDone,
}: {
  departments: readonly string[]
  doctorsByDepartment: Record<string, string[]>
  onDone: () => void
}) {
  const { user } = useAuth()
  const { bookAppointment } = useData()
  const [step, setStep] = useState(0)
  const [department, setDepartment] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [reason, setReason] = useState("")
  const [done, setDone] = useState(false)

  const patient = patients.find((p) => p.id === user?.patientId)
  const doctor = department ? doctorsByDepartment[department]?.[0] : undefined

  function handleConfirm() {
    if (!patient || !department || !doctor || !time) return
    const date = new Date()
    date.setDate(date.getDate() + 3)
    bookAppointment({
      patientId: patient.id,
      patientName: patient.name,
      doctor,
      department,
      date: date.toISOString().slice(0, 10),
      time,
      reason: reason || "General visit",
    })
    setDone(true)
    toast.success("Appointment booked")
  }

  function reset() {
    setStep(0)
    setDepartment(null)
    setTime(null)
    setReason("")
    setDone(false)
    onDone()
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="rounded-2xl bg-white/80 p-3 shadow-sm dark:bg-white/90"
        >
          <img src={appointmentSuccess} alt="" className="h-48 w-64 object-contain" />
        </motion.div>
        <div>
          <p className="font-medium text-foreground">You're all set</p>
          <p className="text-sm text-muted-foreground">
            {department} with {doctor} at {time}.
          </p>
        </div>
        <Button onClick={reset}>Done</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* connected progress track with step dots */}
      <div className="mb-6">
        <div className="relative h-1.5 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            initial={false}
            animate={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        <div className="mt-3 flex justify-between">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  i <= step ? "bg-primary" : "bg-muted"
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  i === step ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="dept"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-2"
            >
              {departments.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDepartment(d)}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-left text-sm font-medium transition-colors hover:border-primary hover:bg-primary/5",
                    department === d && "border-primary bg-primary/10 text-primary"
                  )}
                >
                  {d}
                  <div className="mt-0.5 text-xs font-normal text-muted-foreground">
                    {doctorsByDepartment[d]?.[0]}
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="time"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <p className="text-sm text-muted-foreground">
                Available slots in 3 days with {doctor}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={cn(
                      "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors hover:border-primary hover:bg-primary/5",
                      time === slot && "border-primary bg-primary/10 text-primary"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Reason for visit (optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 rounded-2xl bg-muted/50 p-4"
            >
              <SummaryRow label="Department" value={department ?? "—"} />
              <SummaryRow label="Doctor" value={doctor ?? "—"} />
              <SummaryRow label="Time" value={time ? `In 3 days · ${time}` : "—"} />
              <SummaryRow label="Reason" value={reason || "General visit"} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 0 ? !department : !time}
          >
            Continue
          </Button>
        ) : (
          <Button onClick={handleConfirm}>Confirm booking</Button>
        )}
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}

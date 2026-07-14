import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Pill, Download, RotateCw, Building2, User, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { StatusDot } from "@/components/status-dot"
import { PageHeader } from "@/components/shell/page-header"
import { EmptyState } from "@/components/empty-state"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/context/auth-context"
import { useData } from "@/context/data-context"
import type { Prescription, PrescriptionStatus } from "@/types"
import prescriptionsEmpty from "@/assets/illustrations/prescriptions-empty.svg"

const STATUS_TONE: Record<PrescriptionStatus, "success" | "warning" | "danger"> = {
  active: "success",
  expired: "danger",
  "refill-requested": "warning",
}

const STATUS_LABEL: Record<PrescriptionStatus, string> = {
  active: "Active",
  expired: "Expired",
  "refill-requested": "Refill requested",
}

export default function PrescriptionsPage() {
  const { user } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const { prescriptions, requestRefill } = useData()

  const myPrescriptions = prescriptions
    .filter((p) => p.patientId === user?.patientId)
    .sort((a, b) => b.date.localeCompare(a.date))

  const selected = id ? myPrescriptions.find((p) => p.id === id) : undefined

  return (
    <div>
      <PageHeader
        icon={Pill}
        title="Prescriptions"
        description="Active and past medications prescribed to you."
      />

      {myPrescriptions.length === 0 ? (
        <EmptyState
          title="No prescriptions yet"
          description="Prescriptions from your visits will appear here."
          illustration={<img src={prescriptionsEmpty} alt="" className="h-48 w-64 object-contain" />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {myPrescriptions.map((rx, i) => (
            <PillCard
              key={rx.id}
              rx={rx}
              index={i}
              onOpen={() => navigate(`/prescriptions/${rx.id}`)}
              onRefill={() => requestRefill(rx.id)}
            />
          ))}
        </div>
      )}

      <Sheet
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) navigate("/prescriptions")
        }}
      >
        <SheetContent side="right" className="w-full bg-card/50 backdrop-blur-lg sm:max-w-lg">
          {selected && (
            <PrescriptionDetail rx={selected} onRefill={() => requestRefill(selected.id)} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function PillCard({
  rx,
  index,
  onOpen,
  onRefill,
}: {
  rx: Prescription
  index: number
  onOpen: () => void
  onRefill: () => void
}) {
  function handleRefill(e: React.MouseEvent) {
    e.stopPropagation()
    onRefill()
    toast.success(`Refill requested for ${rx.medicine}`)
  }

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen()
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      className="relative flex flex-col gap-3 rounded-[2rem] border bg-card/95 p-5 text-left shadow-sm transition-shadow hover:cursor-pointer hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Pill className="size-5" strokeWidth={2} />
        </span>
        <StatusDot tone={STATUS_TONE[rx.status]} label={STATUS_LABEL[rx.status]} />
      </div>

      <div>
        <h3 className="font-medium text-foreground">{rx.medicine}</h3>
        <p className="text-sm text-muted-foreground">{rx.dosage}</p>
      </div>

      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>{rx.doctor}</span>
        <span>{formatDate(rx.date)}</span>
      </div>

      {rx.status !== "refill-requested" && (
        <Button size="sm" variant="secondary" className="mt-1 gap-1.5" onClick={handleRefill}>
          <RotateCw className="size-3.5" /> Refill
        </Button>
      )}
    </motion.div>
  )
}

function PrescriptionDetail({ rx, onRefill }: { rx: Prescription; onRefill: () => void }) {
  const [pulsing, setPulsing] = useState(false)
  const [refillJustRequested, setRefillJustRequested] = useState(false)

  useEffect(() => {
    setRefillJustRequested(false)
  }, [rx.id])

  function handleRefill() {
    setPulsing(true)
    onRefill()
    setRefillJustRequested(true)
    toast.success(`Refill requested for ${rx.medicine}`)
    setTimeout(() => setPulsing(false), 600)
  }

  function handleDownload() {
    toast.success("Prescription downloaded (demo file)")
  }

  const showRequested = rx.status === "refill-requested" || refillJustRequested

  return (
    <div className="flex h-full flex-col">
      <SheetHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Pill className="size-4" /> Prescription
        </div>
        <SheetTitle className="text-xl">{rx.medicine}</SheetTitle>
        <SheetDescription>{rx.dosage}</SheetDescription>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Prescribed {formatDate(rx.date)}</span>
          <StatusDot tone={STATUS_TONE[showRequested ? "refill-requested" : rx.status]} label={STATUS_LABEL[showRequested ? "refill-requested" : rx.status]} />
        </div>
      </SheetHeader>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-5 pb-4">
          <div className="rounded-2xl bg-muted/50 p-4">
            <h3 className="mb-2 text-sm font-medium text-foreground">Instructions</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{rx.instructions}</p>
          </div>

          <div className="rounded-2xl bg-muted/50 p-4">
            <h3 className="mb-2 text-sm font-medium text-foreground">Prescribed for</h3>
            <p className="text-sm text-muted-foreground">{rx.prescribedFor}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="size-3.5" /> Prescribing doctor
              </div>
              <div className="mt-1 text-sm font-medium text-foreground">{rx.doctor}</div>
            </div>
            <div className="rounded-xl border px-3 py-2.5">
              <div className="text-xs text-muted-foreground">Refills remaining</div>
              <div className="mt-1 text-sm font-medium text-foreground">{rx.refillsRemaining}</div>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl border px-3 py-2.5">
            <Building2 className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Pharmacy</div>
              <div className="text-sm font-medium text-foreground">{rx.pharmacy}</div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <AlertTriangle className="size-4 text-warning" /> Possible side effects
            </h3>
            <ul className="space-y-1.5">
              {rx.sideEffects.map((effect) => (
                <li key={effect} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="size-1 rounded-full bg-muted-foreground" />
                  {effect}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ScrollArea>

      <div className="flex gap-2 border-t p-4">
        <Button variant="outline" className="flex-1 gap-1.5" onClick={handleDownload}>
          <Download className="size-3.5" /> Download
        </Button>
        {rx.status !== "expired" && (
          <Button
            variant="secondary"
            className="flex-1 gap-1.5"
            onClick={handleRefill}
            disabled={showRequested}
          >
            <motion.span animate={pulsing ? { scale: [1, 1.15, 1] } : {}} transition={{ duration: 0.5 }}>
              <RotateCw className="size-3.5" />
            </motion.span>
            {showRequested ? "Refill requested" : "Refill"}
          </Button>
        )}
      </div>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

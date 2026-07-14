import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Receipt, CreditCard, Check, Stethoscope, Calendar, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shell/page-header"
import { Button } from "@/components/ui/button"
import { StatusDot } from "@/components/status-dot"
import { EmptyState } from "@/components/empty-state"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useAuth } from "@/context/auth-context"
import { useData } from "@/context/data-context"
import type { Invoice, InvoiceStatus } from "@/types"
import { cn } from "@/lib/utils"
import billingEmpty from "@/assets/illustrations/billing-empty.svg"
import billingOverdue from "@/assets/illustrations/billing-overdue.svg"
import paymentSuccess from "@/assets/illustrations/payment-success.svg"

const STATUS_TONE: Record<InvoiceStatus, "success" | "warning" | "danger"> = {
  paid: "success",
  unpaid: "warning",
  overdue: "danger",
}

export default function BillingPage() {
  const { user } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const { invoices, payInvoice } = useData()
  const [filter, setFilter] = useState<InvoiceStatus | "all">("all")
  const [payOpen, setPayOpen] = useState(false)
  const [success, setSuccess] = useState(false)

  const isStaff = user?.role === "staff"

  const scoped = useMemo(
    () => (isStaff ? invoices : invoices.filter((i) => i.patientId === user?.patientId)),
    [invoices, isStaff, user?.patientId]
  )

  const filtered = filter === "all" ? scoped : scoped.filter((i) => i.status === filter)
  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date))

  const selected = id ? scoped.find((i) => i.id === id) : undefined

  useEffect(() => {
    setPayOpen(false)
    setSuccess(false)
  }, [id])

  function handlePay() {
    if (!selected) return
    setTimeout(() => {
      payInvoice(selected.id)
      setSuccess(true)
    }, 600)
  }

  return (
    <div className="xl:max-w-3xl">
      <PageHeader
        icon={Receipt}
        title="Billing"
        description={isStaff ? "Invoices across all patients." : "Your invoices and payment history."}
      />

      <div className="mb-4 flex gap-2">
        {(["all", "unpaid", "overdue", "paid"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium capitalize transition-colors",
              filter === f
                ? "border-primary bg-primary/10 text-primary"
                : "text-muted-foreground hover:border-foreground/20"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          title="No invoices"
          description="Nothing matches this filter."
          illustration={<img src={billingEmpty} alt="" className="h-48 w-64 object-contain" />}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card/95 shadow-sm">
          {sorted.map((inv, i) => (
            <button
              key={inv.id}
              type="button"
              onClick={() => navigate(`/billing/${inv.id}`)}
              className={cn(
                "flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/40",
                i !== sorted.length - 1 && "border-b"
              )}
            >
              <div className="min-w-0">
                <div className="truncate font-medium text-foreground">{inv.service}</div>
                <div className="text-sm text-muted-foreground">
                  {isStaff ? `${inv.patientName} · ` : ""}
                  {formatDate(inv.date)}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <span className="font-medium text-foreground">${inv.amount}</span>
                <StatusDot tone={STATUS_TONE[inv.status]} label={inv.status} />
              </div>
            </button>
          ))}
        </div>
      )}

      <Sheet
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) navigate("/billing")
        }}
      >
        <SheetContent side="right" className="w-full bg-card/50 backdrop-blur-lg sm:max-w-lg">
          {selected && (
            <InvoiceDetail
              invoice={selected}
              isStaff={!!isStaff}
              onPayNow={() => setPayOpen(true)}
              onMarkPaid={() => {
                payInvoice(selected.id)
                toast.success("Marked as paid")
              }}
            />
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={payOpen} onOpenChange={(open) => { setPayOpen(open); if (!open) setSuccess(false) }}>
        <DialogContent className="sm:max-w-sm">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DialogHeader>
                  <DialogTitle>Pay invoice</DialogTitle>
                  <DialogDescription>Demo payment — no real card is charged.</DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-3">
                  <div className="rounded-xl border px-3 py-2.5 text-sm text-muted-foreground">
                    •••• •••• •••• 4242 (demo card)
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium text-foreground">${selected?.amount}</span>
                  </div>
                  <Button className="w-full" onClick={handlePay}>
                    Confirm payment
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-3 py-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="rounded-2xl bg-white/80 p-3 shadow-sm dark:bg-white/90"
                >
                  <img src={paymentSuccess} alt="" className="h-40 w-56 object-contain" />
                </motion.div>
                <div>
                  <p className="font-medium text-foreground">Payment successful</p>
                  <p className="text-sm text-muted-foreground">
                    ${selected?.amount} paid for {selected?.service}
                  </p>
                </div>
                <Button onClick={() => setPayOpen(false)}>Done</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function InvoiceDetail({
  invoice,
  isStaff,
  onPayNow,
  onMarkPaid,
}: {
  invoice: Invoice
  isStaff: boolean
  onPayNow: () => void
  onMarkPaid: () => void
}) {
  const patientResponsibility = invoice.amount - invoice.insuranceCovered

  return (
    <div className="flex h-full flex-col">
      <SheetHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Receipt className="size-4" /> Invoice #{invoice.id}
        </div>
        <SheetTitle className="text-xl">{invoice.service}</SheetTitle>
        <SheetDescription>
          {isStaff ? `${invoice.patientName} · ` : ""}
          {invoice.doctor}
        </SheetDescription>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{formatDate(invoice.date)}</span>
          <StatusDot tone={STATUS_TONE[invoice.status]} label={invoice.status} />
        </div>
      </SheetHeader>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-5 pb-4">
          {invoice.status === "overdue" && (
            <div className="flex items-center gap-4 rounded-2xl bg-destructive/5 p-4">
              <div className="shrink-0 rounded-xl bg-white/80 p-1.5 dark:bg-white/90">
                <img src={billingOverdue} alt="" className="h-16 w-16 object-contain" />
              </div>
              <p className="text-sm text-destructive">
                This invoice is overdue. Pay now to avoid a late fee.
              </p>
            </div>
          )}

          <div className="rounded-2xl bg-muted/50 p-4">
            <h3 className="mb-3 text-sm font-medium text-foreground">Line items</h3>
            <div className="space-y-2">
              {invoice.lineItems.map((item) => (
                <div key={item.label} className="flex justify-between text-sm text-muted-foreground">
                  <span>{item.label}</span>
                  <span>${item.amount}</span>
                </div>
              ))}
              {invoice.insuranceCovered > 0 && (
                <div className="flex justify-between text-sm text-success">
                  <span>Insurance covered</span>
                  <span>−${invoice.insuranceCovered}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 text-sm font-semibold text-foreground">
                <span>{invoice.insuranceCovered > 0 ? "Patient responsibility" : "Total"}</span>
                <span>${invoice.insuranceCovered > 0 ? patientResponsibility : invoice.amount}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Stethoscope className="size-3.5" /> Provider
              </div>
              <div className="mt-1 text-sm font-medium text-foreground">{invoice.doctor}</div>
            </div>
            <div className="rounded-xl border px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="size-3.5" /> Due date
              </div>
              <div className="mt-1 text-sm font-medium text-foreground">{formatDate(invoice.dueDate)}</div>
            </div>
          </div>

          {invoice.status === "paid" && (
            <div className="flex items-start gap-2 rounded-xl border px-3 py-2.5">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" />
              <div>
                <div className="text-xs text-muted-foreground">
                  Paid {invoice.paidDate && formatDate(invoice.paidDate)}
                </div>
                <div className="text-sm font-medium text-foreground">{invoice.paymentMethod}</div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {invoice.status !== "paid" && (
        <div className="border-t p-4">
          {!isStaff ? (
            <Button className="w-full gap-2" onClick={onPayNow}>
              <CreditCard className="size-4" /> Pay now
            </Button>
          ) : (
            <Button className="w-full gap-2" onClick={onMarkPaid}>
              <Check className="size-4" /> Mark as paid
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

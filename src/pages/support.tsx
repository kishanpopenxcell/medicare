import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import {
  LifeBuoy,
  CreditCard,
  Stethoscope,
  Wrench,
  HelpCircle,
  Send,
  User,
  Flag,
} from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shell/page-header"
import { StatusDot } from "@/components/status-dot"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { patients } from "@/data/patients"
import type { Ticket, TicketCategory, TicketPriority, TicketStatus } from "@/types"
import { cn } from "@/lib/utils"
import supportEmpty from "@/assets/illustrations/support-empty.svg"
import supportResolved from "@/assets/illustrations/support-resolved.svg"

const STATUS_TONE: Record<TicketStatus, "warning" | "neutral" | "success"> = {
  open: "warning",
  "in-progress": "neutral",
  resolved: "success",
}

const PRIORITY_TONE: Record<TicketPriority, "neutral" | "warning" | "danger"> = {
  low: "neutral",
  normal: "neutral",
  high: "danger",
}

const CATEGORY_ICON: Record<TicketCategory, typeof CreditCard> = {
  billing: CreditCard,
  medical: Stethoscope,
  technical: Wrench,
  other: HelpCircle,
}

const STATUS_STEPS: TicketStatus[] = ["open", "in-progress", "resolved"]

export default function SupportPage() {
  const { user } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const { tickets, replyToTicket, setTicketStatus } = useData()
  const [params, setParams] = useSearchParams()
  const [newOpen, setNewOpen] = useState(params.get("new") === "1")
  const [filter, setFilter] = useState<TicketStatus | "all">("all")
  const [draft, setDraft] = useState("")

  const isStaff = user?.role === "staff"

  const scoped = useMemo(
    () => (isStaff ? tickets : tickets.filter((t) => t.patientId === user?.patientId)),
    [tickets, isStaff, user?.patientId]
  )
  const filtered = filter === "all" ? scoped : scoped.filter((t) => t.status === filter)
  const sorted = [...filtered].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  const selected = id ? scoped.find((t) => t.id === id) : undefined

  useEffect(() => {
    setDraft("")
  }, [id])

  function handleSend() {
    if (!selected || !draft.trim() || !user) return
    replyToTicket(selected.id, draft.trim(), user.role, user.name)
    setDraft("")
  }

  return (
    <div className="xl:max-w-3xl">
      <PageHeader
        icon={LifeBuoy}
        title="Support"
        description={isStaff ? "Ticket queue across all patients." : "Your support requests."}
        action={
          !isStaff && (
            <Button
              onClick={() => {
                setNewOpen(true)
                setParams({})
              }}
            >
              New ticket
            </Button>
          )
        }
      />

      <div className="mb-4 flex gap-2">
        {(["all", "open", "in-progress", "resolved"] as const).map((f) => (
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
            {f.replace("-", " ")}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          title="No tickets"
          description="You're all caught up."
          illustration={<img src={supportEmpty} alt="" className="h-48 w-64 object-contain" />}
        />
      ) : (
        <div className="space-y-3">
          {sorted.map((ticket, i) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              index={i}
              isStaff={!!isStaff}
              onOpen={() => navigate(`/support/${ticket.id}`)}
            />
          ))}
        </div>
      )}

      <Sheet open={newOpen} onOpenChange={setNewOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>New support ticket</SheetTitle>
            <SheetDescription>Tell us what you need help with.</SheetDescription>
          </SheetHeader>
          <NewTicketForm onDone={() => setNewOpen(false)} />
        </SheetContent>
      </Sheet>

      <Sheet
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) navigate("/support")
        }}
      >
        <SheetContent side="right" className="w-full bg-card/50 backdrop-blur-lg sm:max-w-lg">
          {selected && user && (
            <TicketDetail
              ticket={selected}
              isStaff={!!isStaff}
              draft={draft}
              onDraftChange={setDraft}
              onSend={handleSend}
              onStatusChange={(s) => setTicketStatus(selected.id, s)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function TicketRow({
  ticket,
  index,
  isStaff,
  onOpen,
}: {
  ticket: Ticket
  index: number
  isStaff: boolean
  onOpen: () => void
}) {
  const Icon = CATEGORY_ICON[ticket.category]
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border bg-card/95 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-4.5" strokeWidth={2} />
          </span>
          <div>
            <div className="font-medium text-foreground">{ticket.subject}</div>
            <div className="text-sm text-muted-foreground">
              {isStaff ? `${ticket.patientName} · ` : ""}
              {formatRelative(ticket.updatedAt)}
            </div>
          </div>
        </div>
        <StatusDot tone={STATUS_TONE[ticket.status]} label={ticket.status.replace("-", " ")} />
      </button>
    </motion.div>
  )
}

function TicketDetail({
  ticket,
  isStaff,
  draft,
  onDraftChange,
  onSend,
  onStatusChange,
}: {
  ticket: Ticket
  isStaff: boolean
  draft: string
  onDraftChange: (v: string) => void
  onSend: () => void
  onStatusChange: (s: TicketStatus) => void
}) {
  const { user } = useAuth()
  const Icon = CATEGORY_ICON[ticket.category]

  return (
    <div className="flex h-full flex-col">
      <SheetHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className="size-4" /> {ticket.category}
        </div>
        <SheetTitle className="text-xl">{ticket.subject}</SheetTitle>
        <SheetDescription>
          {ticket.patientName} · Opened {formatRelative(ticket.createdAt)}
        </SheetDescription>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
            <Flag className="size-3" /> Priority:{" "}
            <span className={cn(
              "font-medium capitalize",
              PRIORITY_TONE[ticket.priority] === "danger" && "text-destructive",
            )}>
              {ticket.priority}
            </span>
          </span>
          {ticket.assignedTo && (
            <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
              <User className="size-3" /> {ticket.assignedTo}
            </span>
          )}
        </div>

        <div className="mt-2">
          {isStaff ? (
            <StatusSegmented status={ticket.status} onChange={onStatusChange} />
          ) : (
            <StatusDot tone={STATUS_TONE[ticket.status]} label={ticket.status.replace("-", " ")} />
          )}
        </div>
      </SheetHeader>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-3 pb-4">
          {ticket.messages.map((msg, i) => {
            const isMine = msg.author === user?.role
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className={cn("flex", isMine ? "justify-end" : "justify-start")}
              >
                <div className={cn("max-w-[80%]", isMine && "text-right")}>
                  <div
                    className={cn(
                      "inline-block rounded-2xl px-4 py-2.5 text-sm",
                      isMine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    )}
                  >
                    {msg.body}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {msg.authorName} · {formatTime(msg.timestamp)}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </ScrollArea>

      {ticket.status !== "resolved" ? (
        <div className="flex gap-2 border-t p-4">
          <Textarea
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            placeholder="Type a reply..."
            rows={1}
            className="min-h-11 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                onSend()
              }
            }}
          />
          <Button size="icon" onClick={onSend} disabled={!draft.trim()}>
            <Send className="size-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4 border-t bg-success/5 p-4">
          <div className="shrink-0 rounded-xl bg-white/80 p-1.5 dark:bg-white/90">
            <img src={supportResolved} alt="" className="h-16 w-16 object-contain" />
          </div>
          <p className="text-sm text-success">This ticket has been resolved.</p>
        </div>
      )}
    </div>
  )
}

function StatusSegmented({
  status,
  onChange,
}: {
  status: TicketStatus
  onChange: (s: TicketStatus) => void
}) {
  const activeIndex = STATUS_STEPS.indexOf(status)
  return (
    <div className="relative flex rounded-full border bg-muted/50 p-1">
      <motion.div
        className="absolute top-1 bottom-1 rounded-full bg-primary"
        initial={false}
        animate={{
          left: `calc(${activeIndex} * (100% / 3) + 4px)`,
          width: "calc(100% / 3 - 8px)",
        }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
      />
      {STATUS_STEPS.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={cn(
            "relative z-10 flex-1 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors",
            status === s ? "text-primary-foreground" : "text-muted-foreground"
          )}
        >
          {s.replace("-", " ")}
        </button>
      ))}
    </div>
  )
}

const CATEGORIES: { value: TicketCategory; label: string; icon: typeof CreditCard }[] = [
  { value: "billing", label: "Billing", icon: CreditCard },
  { value: "medical", label: "Medical", icon: Stethoscope },
  { value: "technical", label: "Technical", icon: Wrench },
  { value: "other", label: "Other", icon: HelpCircle },
]

function NewTicketForm({ onDone }: { onDone: () => void }) {
  const { user } = useAuth()
  const { createTicket } = useData()
  const [category, setCategory] = useState<TicketCategory | null>(null)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const patient = patients.find((p) => p.id === user?.patientId)

  function handleSubmit() {
    if (!patient || !category || !subject.trim() || !message.trim()) return
    createTicket({
      patientId: patient.id,
      patientName: patient.name,
      subject: subject.trim(),
      category,
      message: message.trim(),
    })
    toast.success("Ticket created")
    onDone()
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Category</Label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border py-3 text-sm font-medium transition-colors hover:border-primary hover:bg-primary/5",
                category === value && "border-primary bg-primary/10 text-primary"
              )}
            >
              <Icon className="size-5" strokeWidth={2} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief summary" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your issue..."
          rows={5}
        />
      </div>

      <Button className="w-full" onClick={handleSubmit} disabled={!category || !subject.trim() || !message.trim()}>
        Submit ticket
      </Button>
    </div>
  )
}

function formatRelative(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
}

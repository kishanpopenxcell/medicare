import { CalendarDays, FileText, Receipt, LifeBuoy, Users, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/shell/page-header"
import { StatCard } from "@/components/stat-card"
import { useAuth } from "@/context/auth-context"
import { useData } from "@/context/data-context"
import { reports } from "@/data/reports"
import { StatusDot } from "@/components/status-dot"
import { Link } from "react-router-dom"
import dashboardEmpty from "@/assets/illustrations/dashboard-empty.svg"
import staffQueueEmpty from "@/assets/illustrations/staff-queue-empty.svg"

export default function DashboardPage() {
  const { user } = useAuth()
  const { appointments, invoices, tickets } = useData()

  if (!user) return null

  if (user.role === "staff") {
    const openTickets = tickets.filter((t) => t.status !== "resolved").length
    const today = "2026-07-13"
    const todaysAppointments = appointments.filter((a) => a.date === today).length
    const overdueInvoices = invoices.filter((i) => i.status === "overdue").length
    const uniquePatients = new Set(appointments.map((a) => a.patientId)).size

    return (
      <div>
        <PageHeader
          icon={Users}
          title={`Welcome, ${user.name.split(" ")[1] ?? user.name}`}
          description="Here's what's happening across the clinic today."
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={LifeBuoy} label="Open tickets" value={openTickets} tone="warning" delay={0} />
          <StatCard icon={CalendarDays} label="Today's appointments" value={todaysAppointments} delay={0.05} />
          <StatCard icon={Receipt} label="Overdue invoices" value={overdueInvoices} tone="warning" delay={0.1} />
          <StatCard icon={Users} label="Active patients" value={uniquePatients} tone="success" delay={0.15} />
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <QuickList
            title="Ticket queue"
            viewAllHref="/support"
            emptyIllustration={staffQueueEmpty}
            items={tickets.slice(0, 5).map((t) => ({
              id: t.id,
              primary: t.subject,
              secondary: t.patientName,
              tone: t.status === "open" ? "warning" : t.status === "resolved" ? "success" : "neutral",
              statusLabel: t.status,
            }))}
          />
          <QuickList
            title="Today's schedule"
            viewAllHref="/appointments"
            emptyIllustration={staffQueueEmpty}
            items={appointments
              .filter((a) => a.date === today)
              .map((a) => ({
                id: a.id,
                primary: `${a.patientName} — ${a.department}`,
                secondary: a.time,
                tone: a.status === "confirmed" ? "success" : "warning",
                statusLabel: a.status,
              }))}
          />
        </div>
      </div>
    )
  }

  const myReports = reports.filter((r) => r.patientId === user.patientId)
  const myAppointments = appointments
    .filter((a) => a.patientId === user.patientId && a.status !== "cancelled")
    .sort((a, b) => a.date.localeCompare(b.date))
  const nextAppointment = myAppointments.find((a) => a.date >= "2026-07-13")
  const myInvoices = invoices.filter((i) => i.patientId === user.patientId)
  const pendingInvoices = myInvoices.filter((i) => i.status !== "paid").length
  const myTickets = tickets.filter((t) => t.patientId === user.patientId)
  const openTickets = myTickets.filter((t) => t.status !== "resolved").length

  return (
    <div>
      <PageHeader
        icon={Clock}
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Here's a snapshot of your care."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="vital-arc-accent relative col-span-2 row-span-2 overflow-hidden rounded-2xl border bg-card/50 p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 text-primary">
            <CalendarDays className="size-4.5" strokeWidth={2} />
            <span className="text-sm font-medium">Next appointment</span>
          </div>
          {nextAppointment ? (
            <div className="mt-4">
              <div className="text-2xl font-semibold tracking-tight text-foreground">
                {formatDate(nextAppointment.date)}
              </div>
              <div className="text-sm text-muted-foreground">
                {nextAppointment.time} · {nextAppointment.doctor} · {nextAppointment.department}
              </div>
              <Link
                to="/appointments"
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                View calendar →
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No upcoming appointments. Book one from the calendar.
            </p>
          )}
        </motion.div>

        <StatCard icon={FileText} label="Recent reports" value={myReports.length} delay={0.05} />
        <StatCard icon={Receipt} label="Pending invoices" value={pendingInvoices} tone="warning" delay={0.1} />
        <StatCard icon={LifeBuoy} label="Open tickets" value={openTickets} tone="success" delay={0.15} />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <QuickList
          title="Recent reports"
          viewAllHref="/reports"
          emptyIllustration={dashboardEmpty}
          items={myReports.slice(0, 4).map((r) => ({
            id: r.id,
            primary: r.title,
            secondary: formatDate(r.date),
            tone: r.status === "final" ? "success" : "warning",
            statusLabel: r.status === "final" ? "final" : "pending",
            href: `/reports/${r.id}`,
          }))}
        />
        <QuickList
          title="Invoices"
          viewAllHref="/billing"
          emptyIllustration={dashboardEmpty}
          items={myInvoices.slice(0, 4).map((inv) => ({
            id: inv.id,
            primary: inv.service,
            secondary: `$${inv.amount}`,
            tone: inv.status === "paid" ? "success" : inv.status === "overdue" ? "danger" : "warning",
            statusLabel: inv.status,
            href: `/billing/${inv.id}`,
          }))}
        />
      </div>
    </div>
  )
}

function QuickList({
  title,
  viewAllHref,
  items,
  emptyIllustration,
}: {
  title: string
  viewAllHref: string
  emptyIllustration?: string
  items: {
    id: string
    primary: string
    secondary: string
    tone: "success" | "warning" | "danger" | "neutral"
    statusLabel: string
    href?: string
  }[]
}) {
  return (
    <div className="rounded-2xl border bg-card/50 p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium text-foreground">{title}</h3>
        <Link to={viewAllHref} className="text-sm text-primary hover:underline">
          View all
        </Link>
      </div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          {emptyIllustration && (
            <div className="rounded-xl bg-white/80 p-2 dark:bg-white/90">
              <img src={emptyIllustration} alt="" className="h-20 w-28 object-contain" />
            </div>
          )}
          <p className="text-sm text-muted-foreground">Nothing here yet.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item) => {
            const content = (
              <div className="flex items-center justify-between py-2.5">
                <div>
                  <div className="text-sm font-medium text-foreground">{item.primary}</div>
                  <div className="text-xs text-muted-foreground">{item.secondary}</div>
                </div>
                <StatusDot tone={item.tone} label={item.statusLabel} />
              </div>
            )
            return (
              <li key={item.id}>
                {item.href ? (
                  <Link to={item.href} className="block rounded-lg px-1 -mx-1 hover:bg-muted/50">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

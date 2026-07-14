import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  FileText,
  Pill,
  CalendarDays,
  Receipt,
  LifeBuoy,
  PlusCircle,
} from "lucide-react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useAuth } from "@/context/auth-context"
import { useData } from "@/context/data-context"
import { reports as allReports } from "@/data/reports"
import { prescriptions as allPrescriptions } from "@/data/prescriptions"

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { reports, prescriptions, invoices } = usePatientScopedData()

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onOpenChange])

  function go(path: string) {
    navigate(path)
    onOpenChange(false)
  }

  if (!user) return null

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
      <CommandInput placeholder="Search or jump to..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/dashboard")}>
            <LayoutDashboard /> Dashboard
          </CommandItem>
          {user.role === "patient" && (
            <CommandItem onSelect={() => go("/reports")}>
              <FileText /> Medical Reports
            </CommandItem>
          )}
          {user.role === "patient" && (
            <CommandItem onSelect={() => go("/prescriptions")}>
              <Pill /> Prescriptions
            </CommandItem>
          )}
          <CommandItem onSelect={() => go("/appointments")}>
            <CalendarDays /> Appointments
          </CommandItem>
          <CommandItem onSelect={() => go("/billing")}>
            <Receipt /> Billing
          </CommandItem>
          <CommandItem onSelect={() => go("/support")}>
            <LifeBuoy /> Support
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          {user.role === "patient" && (
            <CommandItem onSelect={() => go("/appointments?book=1")}>
              <PlusCircle /> Book an appointment
            </CommandItem>
          )}
          <CommandItem onSelect={() => go("/support?new=1")}>
            <PlusCircle /> New support ticket
          </CommandItem>
        </CommandGroup>

        {user.role === "patient" && reports.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Reports">
              {reports.map((r) => (
                <CommandItem key={r.id} onSelect={() => go(`/reports/${r.id}`)}>
                  <FileText /> {r.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {user.role === "patient" && prescriptions.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Prescriptions">
              {prescriptions.map((p) => (
                <CommandItem key={p.id} onSelect={() => go(`/prescriptions/${p.id}`)}>
                  <Pill /> {p.medicine}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {invoices.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Invoices">
              {invoices.map((inv) => (
                <CommandItem key={inv.id} onSelect={() => go(`/billing/${inv.id}`)}>
                  <Receipt /> {inv.service} — ${inv.amount}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
      </Command>
    </CommandDialog>
  )
}

function usePatientScopedData() {
  const { user } = useAuth()
  const { invoices } = useData()

  const reports = user?.patientId
    ? allReports.filter((r) => r.patientId === user.patientId)
    : []
  const prescriptions = user?.patientId
    ? allPrescriptions.filter((p) => p.patientId === user.patientId)
    : []
  const scopedInvoices = user?.patientId
    ? invoices.filter((i) => i.patientId === user.patientId)
    : invoices

  return { reports, prescriptions, invoices: scopedInvoices }
}

import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { useTheme } from "next-themes"
import {
  LayoutDashboard,
  FileText,
  Pill,
  CalendarDays,
  Receipt,
  LifeBuoy,
  Search,
  Sun,
  Moon,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/reports", icon: FileText, label: "Reports", patientOnly: true },
  { to: "/prescriptions", icon: Pill, label: "Prescriptions", patientOnly: true },
  { to: "/appointments", icon: CalendarDays, label: "Appointments" },
  { to: "/billing", icon: Receipt, label: "Billing" },
  { to: "/support", icon: LifeBuoy, label: "Support" },
]

export function NavRail({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState<string | null>(null)

  if (!user) return null

  const items = NAV_ITEMS.filter((item) => !item.patientOnly || user.role === "patient")
  const roleColor = user.role === "patient" ? "var(--role-patient)" : "var(--role-staff)"

  function toggle(id: string) {
    setExpanded((current) => (current === id ? null : id))
  }

  return (
    <>
      {/* Desktop: fixed horizontal dock, same position on every module */}
      <nav
        className="fixed top-6 right-4 z-40 hidden items-center gap-1 rounded-full border border-border/60 bg-card/70 p-2 shadow-xl backdrop-blur-xl md:right-8 md:flex"
        aria-label="Primary navigation"
      >
        <RailButton
          icon={Search}
          label="Search & jump (⌘K)"
          onClick={onOpenPalette}
          active={false}
          expanded={expanded === "palette"}
          onToggle={() => toggle("palette")}
        />
        <div className="mx-1 h-6 w-px bg-border" />

        {items.map((item) => (
          <NavLink key={item.to} to={item.to} className="relative">
            {({ isActive }) => (
              <RailButton
                icon={item.icon}
                label={item.label}
                active={isActive}
                expanded={isActive}
                onToggle={() => setExpanded(null)}
              />
            )}
          </NavLink>
        ))}

        <div className="mx-1 h-6 w-px bg-border" />

        <RailButton
          icon={theme === "dark" ? Sun : Moon}
          label={theme === "dark" ? "Light mode" : "Dark mode"}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          active={false}
          expanded={expanded === "theme"}
          onToggle={() => toggle("theme")}
        />

        <button
          type="button"
          className="ml-1 flex size-11 shrink-0 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-card"
          style={{ "--tw-ring-color": roleColor } as React.CSSProperties}
        >
          <span
            className="flex size-9 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ background: roleColor }}
          >
            {user.avatarInitials}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            logout()
            navigate("/login")
          }}
          className="flex size-11 items-center justify-center rounded-full text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="size-5" strokeWidth={2} />
        </button>
      </nav>

      {/* Mobile: floating bottom dock */}
      <nav
        className="fixed inset-x-0 bottom-4 z-40 flex justify-center md:hidden"
        aria-label="Primary navigation"
      >
        <div className="flex items-center gap-1 rounded-full border border-border/60 bg-card/80 p-1.5 shadow-xl backdrop-blur-xl">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {({ isActive }) => (
                <span
                  className={cn(
                    "relative flex size-11 items-center justify-center rounded-full transition-colors",
                    isActive ? "text-primary-foreground" : "text-muted-foreground"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="mobile-active-pill"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <item.icon className="relative z-10 size-5" strokeWidth={2} />
                </span>
              )}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={onOpenPalette}
            className="flex size-11 items-center justify-center rounded-full text-muted-foreground"
          >
            <Search className="size-5" strokeWidth={2} />
          </button>
        </div>
      </nav>
    </>
  )
}

function RailButton({
  icon: Icon,
  label,
  active,
  onClick,
  expanded,
  onToggle,
}: {
  icon: typeof LayoutDashboard
  label: string
  active: boolean
  onClick?: () => void
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={() => {
        onToggle()
        onClick?.()
      }}
      className={cn(
        "relative flex h-11 items-center justify-center gap-2 rounded-full text-muted-foreground transition-colors hover:text-foreground",
        expanded && "pr-3",
        active && "text-primary-foreground"
      )}
    >
      {active && (
        <motion.span
          layoutId="rail-active-pill"
          className="absolute inset-0 rounded-full bg-primary shadow-md"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <span className="relative z-10 flex size-11 shrink-0 items-center justify-center">
        <Icon className="size-5" strokeWidth={2} />
      </span>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative z-10 overflow-hidden text-sm font-medium whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

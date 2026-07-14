import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
  const [hovered, setHovered] = useState<string | null>(null)

  if (!user) return null

  const items = NAV_ITEMS.filter((item) => !item.patientOnly || user.role === "patient")
  const roleColor = user.role === "patient" ? "var(--role-patient)" : "var(--role-staff)"

  return (
    <>
      {/* Desktop: floating vertical rail */}
      <nav
        className="fixed top-1/2 left-4 z-40 hidden -translate-y-1/2 flex-col items-center gap-1 rounded-full border border-border/60 bg-card/70 p-2 shadow-xl backdrop-blur-xl md:flex"
        aria-label="Primary navigation"
      >
        <RailButton
          icon={Search}
          label="Search & jump (⌘K)"
          onClick={onOpenPalette}
          active={false}
          hovered={hovered}
          setHovered={setHovered}
          id="palette"
        />
        <div className="my-1 h-px w-6 bg-border" />

        {items.map((item) => (
          <NavLink key={item.to} to={item.to} className="relative">
            {({ isActive }) => (
              <RailButton
                icon={item.icon}
                label={item.label}
                active={isActive}
                hovered={hovered}
                setHovered={setHovered}
                id={item.to}
              />
            )}
          </NavLink>
        ))}

        <div className="my-1 h-px w-6 bg-border" />

        <RailButton
          icon={theme === "dark" ? Sun : Moon}
          label={theme === "dark" ? "Light mode" : "Dark mode"}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          active={false}
          hovered={hovered}
          setHovered={setHovered}
          id="theme"
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onMouseEnter={() => setHovered("avatar")}
              onMouseLeave={() => setHovered(null)}
              className="mt-1 flex size-11 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-card transition-transform hover:scale-105"
              style={{ "--tw-ring-color": roleColor } as React.CSSProperties}
            >
              <span
                className="flex size-9 items-center justify-center rounded-full text-xs font-semibold text-white"
                style={{ background: roleColor }}
              >
                {user.avatarInitials}
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {user.name} · {user.role === "patient" ? "Patient" : "Staff"}
          </TooltipContent>
        </Tooltip>

        <RailButton
          icon={LogOut}
          label="Sign out"
          onClick={() => {
            logout()
            navigate("/login")
          }}
          active={false}
          hovered={hovered}
          setHovered={setHovered}
          id="logout"
        />
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
  hovered,
  setHovered,
  id,
}: {
  icon: typeof LayoutDashboard
  label: string
  active: boolean
  onClick?: () => void
  hovered: string | null
  setHovered: (id: string | null) => void
  id: string
}) {
  return (
    <Tooltip open={hovered === id}>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          onMouseEnter={() => setHovered(id)}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "relative flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground",
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
          <Icon className="relative z-10 size-5" strokeWidth={2} />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

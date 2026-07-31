import { useState } from "react"
import { Outlet } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { useLocation } from "react-router-dom"
import { NavRail } from "@/components/shell/nav-rail"
import { CommandPalette } from "@/components/shell/command-palette"
import { PageBackgroundArt } from "@/components/page-background-art"

export function AppShell() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const location = useLocation()
  // Key the page transition by section only (e.g. "/reports"), not the full
  // path — so opening a detail sheet at /reports/:id doesn't remount the list
  // or replay its enter animation.
  const sectionKey = "/" + (location.pathname.split("/")[1] ?? "")

  return (
    <div className="relative min-h-svh bg-background">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 8% 8%, var(--brand) 0%, transparent 38%), radial-gradient(circle at 95% 15%, var(--role-staff) 0%, transparent 36%), radial-gradient(circle at 85% 92%, var(--success) 0%, transparent 36%), radial-gradient(circle at 10% 90%, var(--warning) 0%, transparent 32%)",
          opacity: 0.16,
        }}
      />

      <PageBackgroundArt />
      <NavRail onOpenPalette={() => setPaletteOpen(true)} />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />

      {/* pb-28 clears the floating bottom dock, which now persists up to lg.
          pt-24 at lg clears the top dock until the viewport is wide enough
          for it to sit beside the page title rather than on top of it. */}
      <main className="relative z-10 mx-auto max-w-[1600px] px-4 pt-8 pb-28 md:px-8 md:pt-10 lg:pt-24 lg:pb-10 xl:pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={sectionKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

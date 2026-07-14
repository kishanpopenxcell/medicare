import { AnimatePresence, motion } from "framer-motion"
import { useLocation } from "react-router-dom"
import bgDashboard from "@/assets/illustrations/bg-dashboard.svg"
import bgReports from "@/assets/illustrations/bg-reports.svg"
import bgPrescriptions from "@/assets/illustrations/bg-prescriptions.svg"
import bgAppointments from "@/assets/illustrations/bg-appointments.svg"
import bgBilling from "@/assets/illustrations/bg-billing.svg"
import bgSupport from "@/assets/illustrations/bg-support.svg"

const ROUTE_ART: { test: RegExp; src: string }[] = [
  { test: /^\/dashboard/, src: bgDashboard },
  { test: /^\/reports/, src: bgReports },
  { test: /^\/prescriptions/, src: bgPrescriptions },
  { test: /^\/appointments/, src: bgAppointments },
  { test: /^\/billing/, src: bgBilling },
  { test: /^\/support/, src: bgSupport },
]

/**
 * Screen-specific illustration, pinned bottom-right, low opacity, behind content.
 * Lives once at the shell level (not per-page) so it never jumps on route change —
 * only its image crossfades when the matching illustration changes.
 */
export function PageBackgroundArt() {
  const { pathname } = useLocation()
  const match = ROUTE_ART.find((r) => r.test.test(pathname))

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-0 bottom-0 z-0 hidden h-[380px] w-[380px] lg:block"
    >
      <AnimatePresence>
        {match && (
          <motion.div
            key={match.src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={match.src}
              alt=""
              className="h-full w-full object-contain [object-position:bottom_right] opacity-[0.1] dark:opacity-[0.06]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

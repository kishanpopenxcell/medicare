import type { ReactNode } from "react"
import { motion } from "framer-motion"

/**
 * Illustration swap point (see DESIGN_SPEC.md §4). Pass a custom `illustration`
 * SVG/img; falls back to a simple line-art placeholder arc so the layout
 * still reads as designed before real artwork is dropped in.
 */
export function EmptyState({
  title,
  description,
  illustration,
  action,
}: {
  title: string
  description?: string
  illustration?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed py-16 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={illustration ? "rounded-2xl bg-white/80 p-4 shadow-sm dark:bg-white/90" : "text-muted-foreground/60"}
      >
        <motion.div
          animate={{ y: [6, 0, 0, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
        >
          {illustration ?? <PlaceholderArc />}
        </motion.div>
      </motion.div>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        {description && (
          <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

function PlaceholderArc() {
  return (
    <svg width="96" height="72" viewBox="0 0 96 72" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M8 50 Q 24 50 30 34 Q 36 18 44 40 Q 52 62 62 34 Q 68 18 88 22" />
      <circle cx="30" cy="34" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="62" cy="34" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

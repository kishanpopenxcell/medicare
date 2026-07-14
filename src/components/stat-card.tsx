import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  hero = false,
  tone = "brand",
  delay = 0,
}: {
  icon: LucideIcon
  label: string
  value: number
  suffix?: string
  hero?: boolean
  tone?: "brand" | "warning" | "success"
  delay?: number
}) {
  const [display, setDisplay] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value)
      return
    }
    const duration = 700
    const start = performance.now()
    let frame: number
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      setDisplay(Math.round(progress * value))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, reduceMotion])

  const toneClasses = {
    brand: "bg-primary/10 text-primary",
    warning: "bg-warning/10 text-warning",
    success: "bg-success/10 text-success",
  }[tone]

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className={cn(
        "vital-arc-accent relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card/50 p-5 shadow-sm transition-shadow hover:shadow-md",
        hero && "sm:col-span-2 sm:row-span-2"
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn("flex size-9 items-center justify-center rounded-xl", toneClasses)}>
          <Icon className="size-4.5" strokeWidth={2} />
        </span>
      </div>
      <div className="mt-4">
        <div className={cn("font-semibold tracking-tight text-foreground", hero ? "text-4xl" : "text-2xl")}>
          {display}
          {suffix}
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </motion.div>
  )
}

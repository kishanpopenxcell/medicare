import { cn } from "@/lib/utils"

const TONE_CLASSES = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  neutral: "bg-muted-foreground",
} as const

export function StatusDot({
  tone,
  label,
}: {
  tone: keyof typeof TONE_CLASSES
  label: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span className={cn("size-1.5 rounded-full", TONE_CLASSES[tone])} />
      <span className="text-muted-foreground">{label}</span>
    </span>
  )
}

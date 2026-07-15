import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { FileText, Search, Download, Check, ArrowUpRight, ArrowDownRight, Minus, Calendar, Paperclip, FileImage } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/shell/page-header"
import { StatusDot } from "@/components/status-dot"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/context/auth-context"
import { reports } from "@/data/reports"
import { EmptyState } from "@/components/empty-state"
import reportsEmpty from "@/assets/illustrations/reports-empty.svg"
import reportAccent from "@/assets/illustrations/report-detail-accent.svg"
import type { MedicalReport } from "@/types"
import { cn } from "@/lib/utils"

export default function ReportsPage() {
  const { user } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [downloaded, setDownloaded] = useState(false)

  const myReports = useMemo(
    () =>
      reports
        .filter((r) => r.patientId === user?.patientId)
        .filter(
          (r) =>
            r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.type.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => b.date.localeCompare(a.date)),
    [user?.patientId, query]
  )

  const selected = id ? reports.find((r) => r.id === id && r.patientId === user?.patientId) : undefined

  useEffect(() => {
    setDownloaded(false)
  }, [id])

  function handleDownload() {
    setDownloaded(true)
    toast.success("Report downloaded (demo file)")
    setTimeout(() => setDownloaded(false), 2000)
  }

  return (
    <div className="xl:max-w-6xl">
      <PageHeader
        icon={FileText}
        title="Medical Reports"
        description="Your test results and clinical findings, in one timeline."
      />

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search reports..."
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {myReports.length === 0 ? (
        <EmptyState
          title="No reports found"
          description="Try a different search, or check back after your next visit."
          illustration={<img src={reportsEmpty} alt="" className="h-48 w-64 object-contain" />}
        />
      ) : (
        <div className="relative pl-6">
          <div className="absolute top-2 bottom-2 left-[7px] w-px bg-border" aria-hidden />
          <div className="space-y-4">
            {myReports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="relative"
              >
                <span
                  className={cn(
                    "absolute top-5 -left-[22px] size-3 rounded-full border-2 border-background",
                    report.status === "final" ? "bg-success" : "bg-warning"
                  )}
                />
                <button
                  type="button"
                  onClick={() => navigate(`/reports/${report.id}`)}
                  className="block w-full rounded-2xl border bg-card/95 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">{report.title}</div>
                      <div className="text-sm text-muted-foreground">{report.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">{formatDate(report.date)}</div>
                      <StatusDot
                        tone={report.status === "final" ? "success" : "warning"}
                        label={report.status === "final" ? "Final" : "Pending review"}
                      />
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <Sheet
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) navigate("/reports")
        }}
      >
        <SheetContent side="right" className="w-full bg-card/50 backdrop-blur-lg sm:max-w-lg">
          {selected && (
            <ReportDetail report={selected} downloaded={downloaded} onDownload={handleDownload} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function ReportDetail({
  report,
  downloaded,
  onDownload,
}: {
  report: MedicalReport
  downloaded: boolean
  onDownload: () => void
}) {
  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="relative overflow-hidden">
        <img
          src={reportAccent}
          alt=""
          className="pointer-events-none absolute -top-4 -right-6 h-28 w-40 object-contain opacity-[0.12] mix-blend-luminosity"
        />
        <div className="relative flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="size-4" /> {report.type}
        </div>
        <SheetTitle className="relative text-xl">{report.title}</SheetTitle>
        <SheetDescription className="relative">
          {report.doctor} · {report.facility}
        </SheetDescription>
        <div className="relative mt-1 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{formatDate(report.date)}</span>
          <StatusDot
            tone={report.status === "final" ? "success" : "warning"}
            label={report.status === "final" ? "Final" : "Pending review"}
          />
        </div>
      </SheetHeader>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-5 pb-4">
          <div className="rounded-2xl bg-muted/50 p-4">
            <h3 className="mb-2 text-sm font-medium text-foreground">Findings</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{report.findings}</p>
          </div>

          <div className="rounded-2xl bg-muted/50 p-4">
            <h3 className="mb-2 text-sm font-medium text-foreground">Recommendation</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{report.recommendation}</p>
          </div>

          {report.followUpDate && (
            <div className="flex items-center gap-2 rounded-2xl border border-dashed px-4 py-3 text-sm">
              <Calendar className="size-4 text-primary" />
              <span className="text-muted-foreground">
                Follow-up recommended by <span className="font-medium text-foreground">{formatDate(report.followUpDate)}</span>
              </span>
            </div>
          )}

          {report.labValues && report.labValues.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-foreground">Lab values</h3>
              <div className="overflow-hidden rounded-2xl border">
                {report.labValues.map((lv, i) => (
                  <div
                    key={lv.label}
                    className={cn(
                      "flex items-center justify-between gap-3 px-4 py-2.5 text-sm",
                      i !== report.labValues!.length - 1 && "border-b"
                    )}
                  >
                    <span className="text-muted-foreground">{lv.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{lv.range}</span>
                      <span
                        className={cn(
                          "flex items-center gap-1 font-medium",
                          lv.flag === "normal" && "text-success",
                          lv.flag === "high" && "text-destructive",
                          lv.flag === "low" && "text-warning"
                        )}
                      >
                        {lv.flag === "high" && <ArrowUpRight className="size-3.5" />}
                        {lv.flag === "low" && <ArrowDownRight className="size-3.5" />}
                        {lv.flag === "normal" && <Minus className="size-3.5" />}
                        {lv.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.attachments.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-foreground">Attachments</h3>
              <div className="space-y-2">
                {report.attachments.map((att) => (
                  <div
                    key={att.name}
                    className="flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm"
                  >
                    {att.kind === "pdf" ? (
                      <Paperclip className="size-4 text-muted-foreground" />
                    ) : (
                      <FileImage className="size-4 text-muted-foreground" />
                    )}
                    <span className="flex-1 truncate text-foreground">{att.name}</span>
                    <span className="text-xs text-muted-foreground">{att.size}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <Button onClick={onDownload} className="w-full gap-2" disabled={downloaded}>
          <motion.span
            animate={downloaded ? { x: 4, opacity: 0 } : { x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            {downloaded ? <Check className="size-4" /> : <Download className="size-4" />}
            {downloaded ? "Downloaded" : "Download report (PDF)"}
          </motion.span>
        </Button>
      </div>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

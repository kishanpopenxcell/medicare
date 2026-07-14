import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import notFoundImg from "@/assets/illustrations/not-found.svg"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/80 p-4 shadow-sm dark:bg-white/90"
      >
        <img src={notFoundImg} alt="" className="h-48 w-72 object-contain" />
      </motion.div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Page not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This page doesn't exist, or you don't have access to it.
        </p>
      </div>
      <Button asChild>
        <Link to="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  )
}

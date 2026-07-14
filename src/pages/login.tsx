import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { HeartPulse, ArrowRight } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import loginHero from "@/assets/illustrations/login-hero.svg"
import { TypewriterText } from "@/components/typewriter-text"

const DEMO_ACCOUNTS = [
  { label: "Patient demo", email: "patient@demo.com" },
  { label: "Staff demo", email: "staff@demo.com" },
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const user = login(email)
    if (!user) {
      setError("No demo account matches that email. Try one of the accounts below.")
      return
    }
    toast.success(`Welcome back, ${user.name.split(" ")[0]}`)
    navigate("/dashboard")
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-4 py-8">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-1/4 -left-1/4 h-[36rem] w-[36rem] rounded-full bg-primary/25 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : { x: [0, 80, 0], y: [0, 60, 0], scale: [1, 1.15, 1] }
          }
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-1/4 h-[32rem] w-[32rem] rounded-full bg-role-staff/20 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : { x: [0, -60, 0], y: [0, 80, 0], scale: [1, 1.2, 1] }
          }
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-1/3 left-1/4 h-[34rem] w-[34rem] rounded-full bg-success/15 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : { x: [0, 70, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }
          }
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-0 right-1/3 h-[26rem] w-[26rem] rounded-full bg-warning/10 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : { x: [0, -50, 0], y: [0, 40, 0] }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-10 grid h-[85svh] max-h-[900px] w-full max-w-6xl gap-0 overflow-hidden rounded-3xl border bg-card shadow-2xl md:grid-cols-2"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, var(--brand) 0%, color-mix(in oklch, var(--brand), var(--role-staff) 45%) 42%, var(--card) 62%, var(--card) 100%)",
            opacity: 0.1,
          }}
        />

        <div className="relative hidden flex-col justify-between p-12 md:flex">
          <div className="relative z-10 flex items-center gap-2 text-primary">
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
            >
              <HeartPulse className="size-7" strokeWidth={2.25} />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
              className="text-lg font-semibold tracking-tight"
            >
              MediCare Connect
            </motion.span>
          </div>

          <div className="relative z-10 space-y-5">
            <img src={loginHero} alt="" className="h-72 w-full object-contain" />
            <h2 className="min-h-10 text-3xl font-semibold text-foreground">
              <TypewriterText text="Your care, all in one place" startDelay={300} />
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.4 }}
              className="max-w-md text-base text-muted-foreground"
            >
              Reports, prescriptions, appointments, billing, and support — a
              connected view of your health journey.
            </motion.p>
          </div>

          <div className="relative z-10" />
        </div>

        <div className="relative z-10 flex flex-col justify-center gap-8 overflow-y-auto p-10 sm:p-16">
          <div className="space-y-1.5 md:hidden">
            <div className="flex items-center gap-2 text-primary">
              <motion.span
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <HeartPulse className="size-5" strokeWidth={2.25} />
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, delay: 0.4, ease: "easeOut" }}
                className="font-semibold tracking-tight"
              >
                MediCare Connect
              </motion.span>
            </div>
          </div>

          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-3xl font-semibold tracking-tight"
            >
              Welcome back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.12, ease: "easeOut" }}
              className="text-base text-muted-foreground"
            >
              Sign in to view your dashboard. This is a demo — any password works.
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="patient@demo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                }}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}

            <Button type="submit" size="lg" className="w-full gap-1.5">
              Sign in
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">demo accounts</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {DEMO_ACCOUNTS.map((acct, i) => (
                <motion.button
                  key={acct.email}
                  type="button"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.5 + i * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setEmail(acct.email)
                    setError(null)
                  }}
                  className="rounded-xl border border-dashed px-4 py-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <div className="font-medium text-foreground">{acct.label}</div>
                  <div className="text-xs text-muted-foreground">{acct.email}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

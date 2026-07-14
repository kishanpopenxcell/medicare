import { Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "@/context/auth-context"
import { AppShell } from "@/components/shell/app-shell"
import LoginPage from "@/pages/login"
import DashboardPage from "@/pages/dashboard"
import ReportsPage from "@/pages/reports"
import PrescriptionsPage from "@/pages/prescriptions"
import AppointmentsPage from "@/pages/appointments"
import BillingPage from "@/pages/billing"
import SupportPage from "@/pages/support"
import NotFoundPage from "@/pages/not-found"

function ProtectedLayout() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <AppShell />
}

export function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/reports/:id" element={<ReportsPage />} />
        <Route path="/prescriptions" element={<PrescriptionsPage />} />
        <Route path="/prescriptions/:id" element={<PrescriptionsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/billing/:id" element={<BillingPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/support/:id" element={<SupportPage />} />
      </Route>

      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "@/context/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { DataProvider } from "@/context/data-context"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { AppRoutes } from "@/routes"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <TooltipProvider delayDuration={200}>
            <BrowserRouter>
              <AppRoutes />
              <Toaster position="bottom-right" />
            </BrowserRouter>
          </TooltipProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

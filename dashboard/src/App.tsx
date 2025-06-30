import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import Dashboard from "@/pages/dashboard"
import LogsPage from "@/pages/logs"
import { ConnectionProvider } from "@/contexts/connection-context"

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <ConnectionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="/logs" element={<LogsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ConnectionProvider>
    </ThemeProvider>
  )
}

export default App

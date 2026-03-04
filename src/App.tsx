import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { Toaster } from "sonner"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/CartContext"
import { DataProvider } from "@/contexts/DataContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Home } from "@/pages/Home"
import {
  AdminLogin,
  AdminLayout,
  AdminDashboard,
  AdminEvents,
  AdminProducts,
  AdminWorkshops,
  AdminGuidedTours,
  AdminTeamMembers,
  AdminMemberships,
  AdminSponsors,
  AdminPages,
  AdminSubscribers,
  AdminSettings,
  AdminValidateEntry,
} from "@/pages/admin"

function SpaRedirectHandler({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const redirect = sessionStorage.getItem("spa_redirect")
    if (redirect) {
      sessionStorage.removeItem("spa_redirect")
      navigate(redirect, { replace: true })
    }
    setReady(true)
  }, [navigate])

  if (!ready) return null
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <SpaRedirectHandler>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />

            {/* Admin routes */}
            <Route path="/panel/login" element={<AdminLogin />} />
            <Route
              path="/panel"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="eventos" element={<AdminEvents />} />
              <Route path="talleres" element={<AdminWorkshops />} />
              <Route path="visitas" element={<AdminGuidedTours />} />
              <Route path="productos" element={<AdminProducts />} />
              <Route path="equipo" element={<AdminTeamMembers />} />
              <Route path="membresias" element={<AdminMemberships />} />
              <Route path="patrocinadores" element={<AdminSponsors />} />
              <Route path="paginas" element={<AdminPages />} />
              <Route path="suscriptores" element={<AdminSubscribers />} />
              <Route path="configuracion" element={<AdminSettings />} />
              <Route path="validar-entrada" element={<AdminValidateEntry />} />
            </Route>

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster richColors position="top-center" />
          </CartProvider>
        </DataProvider>
      </AuthProvider>
      </SpaRedirectHandler>
    </BrowserRouter>
  )
}

export default App

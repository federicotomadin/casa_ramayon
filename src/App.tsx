import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
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
} from "@/pages/admin"

function App() {
  return (
    <BrowserRouter>
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
              <Route path="sponsors" element={<AdminSponsors />} />
              <Route path="paginas" element={<AdminPages />} />
              <Route path="suscriptores" element={<AdminSubscribers />} />
              <Route path="configuracion" element={<AdminSettings />} />
            </Route>

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

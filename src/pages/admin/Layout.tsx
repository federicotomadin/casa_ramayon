import { useState } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Calendar, ShoppingBag, Settings, LogOut, Menu, X, Home } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/panel", icon: LayoutDashboard },
  { name: "Eventos", href: "/panel/eventos", icon: Calendar },
  { name: "Productos", href: "/panel/productos", icon: ShoppingBag },
  { name: "Configuración", href: "/panel/configuracion", icon: Settings },
]

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    localStorage.removeItem("casa_ramayon_demo_auth")
    try { await signOut() } catch {}
    navigate("/panel/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={cn("fixed top-0 left-0 z-50 h-full w-64 bg-card border-r transform transition-transform lg:translate-x-0", sidebarOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link to="/panel" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"><span className="text-primary-foreground font-bold text-sm">CR</span></div>
              <span className="font-semibold">Casa Ramayon</span>
            </Link>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></Button>
          </div>
          <ScrollArea className="flex-1 py-4">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = item.href === "/panel" ? location.pathname === "/panel" : location.pathname.startsWith(item.href)
                return (
                  <Link key={item.name} to={item.href} onClick={() => setSidebarOpen(false)} className={cn("flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium", isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center"><span className="text-xs font-medium">{user?.email?.charAt(0).toUpperCase() || "A"}</span></div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{user?.email || "Admin"}</p></div>
            </div>
            <Button variant="ghost" className="w-full justify-start" asChild><Link to="/"><Home className="h-4 w-4 mr-2" />Ver Sitio</Link></Button>
            <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleSignOut}><LogOut className="h-4 w-4 mr-2" />Cerrar Sesión</Button>
          </div>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 h-16 bg-background/95 backdrop-blur border-b flex items-center px-4 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></Button>
          <h1 className="text-lg font-semibold">Panel</h1>
        </header>
        <main className="p-4 lg:p-8"><Outlet /></main>
      </div>
    </div>
  )
}

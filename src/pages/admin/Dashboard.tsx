import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ShoppingBag, Settings } from "lucide-react"

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/panel/eventos"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Calendar />Eventos</CardTitle></CardHeader><CardContent>Gestionar eventos</CardContent></Card></Link>
        <Link to="/panel/productos"><Card><CardHeader><CardTitle className="flex items-center gap-2"><ShoppingBag />Productos</CardTitle></CardHeader><CardContent>Gestionar tienda</CardContent></Card></Link>
        <Link to="/panel/configuracion"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Settings />Configuración</CardTitle></CardHeader><CardContent>Ajustes del sitio</CardContent></Card></Link>
      </div>
    </div>
  )
}

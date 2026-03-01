import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/contexts/DataContext"
import {
  Calendar, ShoppingBag, Settings, Users,
  BookOpen, Map, Heart, FileText, Mail, Handshake
} from "lucide-react"

export function AdminDashboard() {
  const {
    events, products, workshops, guidedTours, memberships,
    sponsors, teamMembers, pages, subscribers, useLocalStorage,
  } = useData()

  const sections = [
    { name: "Eventos", href: "/panel/eventos", icon: Calendar, count: events.length },
    { name: "Productos", href: "/panel/productos", icon: ShoppingBag, count: products.length },
    { name: "Talleres", href: "/panel/talleres", icon: BookOpen, count: workshops.length },
    { name: "Visitas Guiadas", href: "/panel/visitas", icon: Map, count: guidedTours.length },
    { name: "Membresías", href: "/panel/membresias", icon: Heart, count: memberships.length },
    { name: "Patrocinadores", href: "/panel/patrocinadores", icon: Handshake, count: sponsors.length },
    { name: "Equipo", href: "/panel/equipo", icon: Users, count: teamMembers.length },
    { name: "Páginas", href: "/panel/paginas", icon: FileText, count: pages.length },
    { name: "Suscriptores", href: "/panel/suscriptores", icon: Mail, count: subscribers.length },
    { name: "Configuración", href: "/panel/configuracion", icon: Settings },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        {useLocalStorage && (
          <Badge variant="secondary">Modo localStorage</Badge>
        )}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sections.map((section) => (
          <Link key={section.name} to={section.href}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <section.icon className="h-5 w-5 text-primary" />
                    {section.name}
                  </span>
                  {section.count !== undefined && (
                    <Badge variant="secondary">{section.count}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Gestionar {section.name.toLowerCase()}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

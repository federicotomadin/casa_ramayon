import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, Users, DollarSign } from "lucide-react"
import { useData } from "@/contexts/DataContext"

const BASE_URL = import.meta.env.BASE_URL

export function WorkshopsSection() {
  const { workshops, loading } = useData()

  const activeWorkshops = workshops.filter((w) => w.isActive)

  if (loading) {
    return (
      <section id="talleres" className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando talleres...</p>
          </div>
        </div>
      </section>
    )
  }

  if (activeWorkshops.length === 0) return null

  return (
    <section id="talleres" className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            Talleres y <span className="italic">Formación</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cursos y workshops para desarrollar tu creatividad
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeWorkshops.map((workshop) => (
            <Card key={workshop.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-52 overflow-hidden">
                <img
                  src={workshop.image || `${BASE_URL}placeholder.svg`}
                  alt={workshop.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-mono">
                    {workshop.category}
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-2">{workshop.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  por {workshop.instructor}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-mono">{workshop.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-mono">{workshop.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-mono">
                      {workshop.capacity} lugares
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm font-mono">{workshop.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

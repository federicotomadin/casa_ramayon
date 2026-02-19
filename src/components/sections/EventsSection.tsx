import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Ticket } from "lucide-react"
import { useData } from "@/contexts/DataContext"

const BASE_URL = import.meta.env.BASE_URL

export function EventsSection() {
  const { events, loading } = useData()

  // Filter only active events
  const activeEvents = events.filter((event) => event.isActive)

  if (loading) {
    return (
      <section id="events" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando eventos...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="events" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            Próximos <span className="italic">Eventos</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sumérgete en experiencias culturales seleccionadas que inspiran e iluminan
          </p>
        </div>

        {activeEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay eventos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={event.image || `${BASE_URL}placeholder.svg`}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-mono">
                      {event.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-medium mb-4">{event.title}</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-mono">{event.date}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-mono">{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Ticket className="h-4 w-4" />
                      <span className="text-sm font-mono">{event.price}</span>
                    </div>
                  </div>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Reservar Entradas
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeEvents.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Ver Todos los Eventos
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

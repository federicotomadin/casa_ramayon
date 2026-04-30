import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Clock, Users, DollarSign, MapPin } from "lucide-react"
import { useData } from "@/contexts/DataContext"
import type { GuidedTour } from "@/types"

const BASE_URL = import.meta.env.BASE_URL

export function GuidedToursSection() {
  const { guidedTours, loading } = useData()
  const [selectedTour, setSelectedTour] = useState<GuidedTour | null>(null)

  const activeTours = guidedTours.filter((t) => t.isActive)

  if (loading) {
    return (
      <section id="visitas" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando visitas...</p>
          </div>
        </div>
      </section>
    )
  }

  if (activeTours.length === 0) return null

  return (
    <section id="visitas" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Visitas <span className="font-sans font-bold italic">Guiadas</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Recorré la casa y descubrí su historia de la mano de nuestros guías
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTours.map((tour) => (
            <Card
              key={tour.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedTour(tour)}
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={tour.image || `${BASE_URL}placeholder.svg`}
                  alt={tour.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-sans font-bold mb-3">{tour.title}</h3>
                {tour.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {tour.description}
                  </p>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-mono">{tour.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-mono">{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-mono">
                      {tour.capacity} personas max.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm font-mono">{tour.price}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Ver más
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedTour} onOpenChange={(open) => !open && setSelectedTour(null)}>
        {selectedTour && (
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedTour.title}</DialogTitle>
            </DialogHeader>

            <div className="rounded-lg overflow-hidden mb-4">
              <img
                src={selectedTour.image || `${BASE_URL}placeholder.svg`}
                alt={selectedTour.title}
                className="w-full h-56 object-cover"
              />
            </div>

            {selectedTour.description && (
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {selectedTour.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 mt-4 p-4 rounded-lg bg-muted/30 border">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">{selectedTour.schedule}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm">{selectedTour.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm">{selectedTour.capacity} personas</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{selectedTour.price}</span>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  )
}

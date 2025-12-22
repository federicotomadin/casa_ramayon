import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={`${import.meta.env.BASE_URL}casa_ramayon.png`}
          alt="Galería de arte cultural"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6 text-balance">
          Donde la cultura encuentra
          <br />
          <span className="italic font-normal">experiencia</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Descubre eventos culturales, reserva tu mesa y explora materiales de arte
          seleccionados para tu viaje creativo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base">
            Explorar Eventos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="text-base bg-transparent">
            Ver Tienda
          </Button>
        </div>
      </div>
    </section>
  )
}

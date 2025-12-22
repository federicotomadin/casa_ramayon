import {Facebook, Instagram, Mail, Twitter} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-foreground text-primary rounded-sm flex items-center justify-center">
                <span className="font-bold text-xl">CR</span>
              </div>
              <span className="text-xl font-semibold tracking-tight">Casa Ramayon</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Celebrando el arte, la cultura y la creatividad a través de experiencias inmersivas y materiales de
              calidad.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#events"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Eventos
                </a>
              </li>
              <li>
                <a
                  href="#bookings"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Reservas
                </a>
              </li>
              <li>
                <a href="#shop" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Tienda
                </a>
              </li>
              <li>
                <a href="#about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Acerca de Nosotros
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-medium text-lg mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Envíos
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Devoluciones
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-medium text-lg mb-4">Mantente Actualizado</h3>
            <p className="text-primary-foreground/80 mb-4 text-sm">
              Suscríbete a nuestro boletín para recibir los últimos eventos y ofertas exclusivas
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Tu correo"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
              />
              <Button variant="secondary" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm font-mono">
            © 2025 Casa Ramayon. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary-foreground/80">
              <Facebook className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary-foreground/80">
              <Instagram className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary-foreground/80">
              <Twitter className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { useState } from "react"
import { Instagram, Mail, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useData } from "@/contexts/DataContext"

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_NEWSLETTER_ID as string | undefined

async function notifyAdmin(email: string) {
  if (!FORMSPREE_ID) return
  await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      subject: "Nueva suscripción al boletín - Casa Ramayon",
      message: `Un usuario se suscribió al boletín: ${email}`,
    }),
  })
}

export function Footer() {
  const { addSubscriber } = useData()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return
    setStatus("loading")
    setErrorMessage("")
    try {
      await addSubscriber(trimmed)
      await notifyAdmin(trimmed)
      setEmail("")
      setStatus("success")
    } catch (err) {
      setStatus("error")
      setErrorMessage((err as Error)?.message || "Error al suscribirse")
    }
  }

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-foreground text-primary rounded-full flex items-center justify-center">
                <span className="font-serif font-medium text-lg">CR</span>
              </div>
              <span className="text-2xl font-serif italic tracking-wide">Casa Ramayon</span>
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
                <a href="#amigo" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Hacete Amigo
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
                <a href="#contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
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
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                required
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
              />
              <Button
                type="submit"
                variant="secondary"
                size="icon"
                disabled={status === "loading"}
                aria-label="Suscribirse"
              >
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : status === "success" ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
              </Button>
            </form>
            {status === "success" && (
              <p className="mt-2 text-sm text-green-300">¡Gracias por suscribirte!</p>
            )}
            {status === "error" && (
              <p className="mt-2 text-sm text-red-200">{errorMessage}</p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
            <p className="text-primary-foreground/60 text-sm font-mono">
              2025 Casa Ramayon. Todos los derechos reservados.
            </p>
            <p className="text-primary-foreground/60 text-sm font-mono">
              Sitio creado por{" "}
              <a
                href="https://www.linkedin.com/in/federicotomadin/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground underline underline-offset-2 transition-colors"
              >
                Federico Tomadin
              </a>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary-foreground/80" asChild>
              <a href="https://www.instagram.com/casaramayon/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}

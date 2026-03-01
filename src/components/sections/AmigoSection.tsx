import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { MessageCircle, Check, Star } from "lucide-react"

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "5491112345678"
const WHATSAPP_MESSAGE = "Hola! Me interesa ser parte de la comunidad Hacete Amigo de Casa Ramayon. Me gustaría recibir más información."

function getWhatsAppUrl() {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
}

export function AmigoSection() {
  const { memberships, pages } = useData()
  const amigoPage = pages.find((p) => p.slug === "amigo")
  const intro = amigoPage?.subtitle ?? "Sumate a la comunidad de Casa Ramayon."
  const tagline = amigoPage?.content ?? "Tu generosidad construye la cultura."
  const active = memberships.filter((m) => m.isActive)

  return (
    <section id="amigo" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Hacete Amigo</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{intro}</p>
          <p className="text-primary font-medium mt-2 italic">{tagline}</p>
        </div>

        {active.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {active.map((m) => (
              <div
                key={m.id}
                className={`relative p-8 rounded-xl border-2 bg-background transition-shadow hover:shadow-lg ${
                  m.featured ? "border-primary shadow-md" : "border-border"
                }`}
              >
                {m.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Recomendado
                  </div>
                )}
                <h3 className="font-serif font-semibold text-xl mb-1">{m.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold text-primary">{m.price}</span>
                  <span className="text-muted-foreground">/ {m.period}</span>
                </div>
                {m.description && (
                  <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{m.description}</p>
                )}
                {m.benefits.length > 0 && (
                  <ul className="space-y-2.5 mb-6">
                    {m.benefits.map((b: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Button
                  className="w-full gap-2"
                  variant={m.featured ? "default" : "outline"}
                  asChild
                >
                  <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    Quiero ser {m.name.split("–")[0]?.trim() || "Amigo"}
                  </a>
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <p className="text-muted-foreground mb-4">¿Tenés dudas? Escribinos por WhatsApp</p>
          <Button size="lg" className="gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white" asChild>
            <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              Contactar por WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

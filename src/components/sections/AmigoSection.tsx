import { useData } from "@/contexts/DataContext"

export function AmigoSection() {
  const { memberships, pages } = useData()
  const amigoPage = pages.find((p) => p.slug === "amigo")
  const intro = amigoPage?.subtitle ?? "Sumate a la comunidad de Casa Ramayon."
  const tagline = amigoPage?.content ?? "Tu generosidad construye la cultura."
  const active = memberships.filter((m) => m.isActive)

  return (
    <section id="amigo" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">Hacete Amigo</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{intro}</p>
          <p className="text-primary font-medium mt-2">{tagline}</p>
        </div>
        {active.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {active.map((m) => (
              <div key={m.id} className="p-6 rounded-lg border bg-background">
                <h3 className="font-semibold text-lg">{m.name}</h3>
                <p className="text-muted-foreground">{m.price} / {m.period}</p>
                <p className="text-sm mt-2">{m.description}</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {m.benefits.slice(0, 3).map((b: string, i: number) => (
                    <li key={i}>• {b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

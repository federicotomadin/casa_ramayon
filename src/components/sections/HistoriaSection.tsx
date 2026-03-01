import { useData } from "@/contexts/DataContext"

export function HistoriaSection() {
  const { pages } = useData()
  const page = pages.find((p) => p.slug === "historia")

  const title = page?.title || "Nuestra Historia"
  const subtitle = page?.subtitle || ""
  const content = page?.content || "Casa Ramayon nació de la pasión por el arte y la cultura. Un espacio donde la historia se encuentra con la creatividad, y donde cada rincón cuenta una historia."
  const image = page?.image || ""

  const paragraphs = content.split("\n").filter((p) => p.trim())

  return (
    <section id="historia" className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">{title}</h2>
            {subtitle && (
              <p className="text-primary font-medium text-lg mb-6 italic">{subtitle}</p>
            )}
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <div className="relative">
            {image ? (
              <img
                src={image}
                alt={title}
                className="rounded-xl w-full aspect-[4/3] object-cover shadow-lg"
              />
            ) : (
              <div className="rounded-xl w-full aspect-[4/3] bg-muted/50 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Imagen de historia</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

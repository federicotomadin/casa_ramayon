import { useData } from "@/contexts/DataContext"

export function EspacioSection() {
  const { pages } = useData()
  const page = pages.find((p) => p.slug === "espacio")

  const title = page?.title || "El Espacio"
  const subtitle = page?.subtitle || ""
  const content = page?.content || "Un lugar único donde confluyen el arte, la gastronomía y la cultura. Nuestras instalaciones están diseñadas para inspirar y conectar."
  const image = page?.image || ""
  const gallery = page?.gallery || []

  const paragraphs = content.split("\n").filter((p) => p.trim())

  return (
    <section id="espacio" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            {image ? (
              <img
                src={image}
                alt={title}
                className="rounded-xl w-full aspect-[4/3] object-cover shadow-lg"
              />
            ) : (
              <div className="rounded-xl w-full aspect-[4/3] bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Imagen del espacio</span>
              </div>
            )}
            {gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {gallery.slice(0, 3).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${title} ${i + 1}`}
                    className="rounded-lg w-full aspect-square object-cover"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{title}</h2>
            {subtitle && (
              <p className="text-primary font-medium text-lg mb-6 italic">{subtitle}</p>
            )}
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

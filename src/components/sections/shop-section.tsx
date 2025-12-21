import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"

const products = [
  {
    id: 1,
    name: "Set Profesional de Acrílicos",
    price: "$89.99",
    image: "/professional-acrylic-paint-set.jpg",
    category: "Pintura",
  },
  {
    id: 2,
    name: "Colección Premium de Pinceles",
    price: "$54.99",
    image: "/premium-artist-paint-brushes.jpg",
    category: "Herramientas",
  },
  {
    id: 3,
    name: "Pack Inicial de Lienzos",
    price: "$39.99",
    image: "/blank-art-canvas-set.jpg",
    category: "Lienzo",
  },
  {
    id: 4,
    name: "Set Maestro de Acuarelas",
    price: "$124.99",
    image: "/watercolor-paint-set.jpg",
    category: "Pintura",
  },
  {
    id: 5,
    name: "Kit de Lápices para Dibujo",
    price: "$29.99",
    image: "/professional-sketching-pencils.jpg",
    category: "Herramientas",
  },
  {
    id: 6,
    name: "Colección de Óleo",
    price: "$149.99",
    image: "/oil-paint-tubes-set.jpg",
    category: "Pintura",
  },
]

export function ShopSection() {
  return (
    <section id="shop" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            Materiales de <span className="italic">Arte</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Materiales premium seleccionados para artistas en cada etapa de su viaje creativo
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-xs font-mono">
                    {product.category}
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-2">{product.name}</h3>
                <p className="text-2xl font-light text-accent">{product.price}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Agregar al Carrito
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Ver Catálogo Completo
          </Button>
        </div>
      </div>
    </section>
  )
}

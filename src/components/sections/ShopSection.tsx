import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingBag, ShoppingCart } from "lucide-react"
import { useData } from "@/contexts/DataContext"
import { useCart } from "@/contexts/CartContext"

const BASE_URL = import.meta.env.BASE_URL

export function ShopSection() {
  const { products, loading } = useData()
  const { addToCart, openCart } = useCart()

  // Filter only active products
  const activeProducts = products.filter((product) => product.isActive)

  const handleBuy = (product: (typeof activeProducts)[0]) => {
    addToCart(product)
    openCart()
  }

  const handleAddToCart = (product: (typeof activeProducts)[0]) => {
    addToCart(product)
  }

  if (loading) {
    return (
      <section id="shop" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando productos...</p>
          </div>
        </div>
      </section>
    )
  }

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

        {activeProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay productos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.image || `${BASE_URL}placeholder.svg`}
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
                <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-2">
                  <Button
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => handleBuy(product)}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Comprar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Agregar al Carrito
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {activeProducts.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Ver Catálogo Completo
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

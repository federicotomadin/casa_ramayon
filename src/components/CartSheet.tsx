import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/contexts/CartContext"
import { Minus, Plus, ShoppingCart, Trash2, Loader2 } from "lucide-react"
import { getCallable } from "@/lib/firebase"

const BASE_URL = import.meta.env.BASE_URL
const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin

interface CartSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, removeFromCart, updateQuantity, itemCount, totalFormatted } = useCart()
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrito de compras
            {itemCount > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({itemCount} {itemCount === 1 ? "producto" : "productos"})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Tu carrito está vacío. Agregá productos desde la tienda.
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-3 p-3 rounded-lg border bg-muted/30">
                  <div className="w-16 h-16 shrink-0 rounded overflow-hidden bg-muted">
                    <img
                      src={product.image || `${BASE_URL}placeholder.svg`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-2 text-sm w-8 text-center font-mono">{quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(product.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <SheetFooter className="flex flex-col gap-4 border-t px-6 pt-6 pb-6 mt-auto shrink-0">
            <div className="flex justify-between items-center text-lg font-medium w-full">
              <span>Total</span>
              <span className="text-primary">{totalFormatted}</span>
            </div>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={checkoutLoading}
              onClick={async () => {
                setCheckoutLoading(true)
                try {
                  const createCheckout = getCallable<
                    {
                      items: { productId: string; name: string; price: string; image?: string; quantity: number }[]
                      siteUrl?: string
                    },
                    { initPoint: string }
                  >("createMpCheckout")
                  const { data } = await createCheckout({
                    items: items.map(({ product, quantity }) => ({
                      productId: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image || undefined,
                      quantity,
                    })),
                    siteUrl: SITE_URL,
                  })
                  if (data?.initPoint) window.location.href = data.initPoint
                } catch (err) {
                  console.error("Checkout error:", err)
                  alert((err as Error)?.message || "Error al iniciar el pago.")
                  setCheckoutLoading(false)
                }
              }}
            >
              {checkoutLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Pagar con Mercado Pago
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

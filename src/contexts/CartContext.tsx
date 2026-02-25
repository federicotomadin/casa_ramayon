import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import type { Product } from "@/types"

export interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  totalFormatted: string
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  openCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = "casa_ramayon_cart"

function parsePrice(priceStr: string): number {
  const match = priceStr.replace(/\s/g, "").match(/(\d+(?:[.,]\d+)?)/)
  if (!match) return 0
  return parseFloat(match[1].replace(",", "."))
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount)
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch {}
    return []
  })
  const [cartOpen, setCartOpen] = useState(false)

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.product.id === product.id)
        const next = existing
          ? prev.map((i) =>
              i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
            )
          : [...prev, { product, quantity }]
        const filtered = next.filter((i) => i.quantity > 0)
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
        } catch {}
        return filtered
      })
    },
    []
  )

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.product.id !== productId)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      const next = prev
        .map((i) => (i.product.id === productId ? { ...i, quantity: Math.max(0, quantity) } : i))
        .filter((i) => i.quantity > 0)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const openCart = useCallback(() => setCartOpen(true), [])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const total = items.reduce((sum, i) => sum + parsePrice(i.product.price) * i.quantity, 0)
  const totalFormatted = formatPrice(total)

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalFormatted,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        openCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

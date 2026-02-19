import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X, ChevronDown, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { useCart } from "@/contexts/CartContext"
import { CartSheet } from "@/components/CartSheet"

const menuItems = {
  nosotros: {
    label: "Nosotros",
    items: [
      { label: "Historia", href: "#historia", description: "Conocé nuestra historia" },
      { label: "El Espacio", href: "#espacio", description: "Descubrí nuestras instalaciones" },
      { label: "Equipo", href: "#equipo", description: "Las personas detrás de Casa Ramayon" },
    ],
  },
  programacion: {
    label: "Programación",
    items: [
      { label: "Próximos Eventos", href: "#events", description: "Agenda de eventos y entradas" },
      { label: "Talleres y Formación", href: "#talleres", description: "Cursos y workshops" },
      { label: "Visitas Guiadas", href: "#visitas", description: "Programa 'Visitá la casa'" },
    ],
  },
  tienda: {
    label: "Tienda",
    items: [
      { label: "Obras de Arte", href: "#shop", description: "Catálogo de obras en venta" },
      { label: "Tienda de Objetos", href: "#objetos", description: "Merch, yerbas, libros y vinos" },
    ],
  },
  comunidad: {
    label: "Comunidad",
    items: [
      { label: "Hacete Amigo", href: "#amigo", description: "Membresías y socios" },
      { label: "Patrocinadores", href: "#sponsors", description: "Apoyos y colaboradores" },
    ],
  },
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null)
  const { itemCount, cartOpen, setCartOpen } = useCart()

  const toggleMobileSubmenu = (key: string) => {
    setOpenMobileMenu(openMobileMenu === key ? null : key)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-medium text-lg">CR</span>
            </div>
            <span className="text-xl lg:text-2xl font-serif italic tracking-wide text-foreground">
              Casa Ramayon
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {Object.entries(menuItems).map(([key, menu]) => (
                <NavigationMenuItem key={key}>
                  <NavigationMenuTrigger className="bg-transparent">
                    {menu.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-1 p-2">
                      {menu.items.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <a
                              href={item.href}
                              className={cn(
                                "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors",
                                "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              )}
                            >
                              <div className="text-sm font-medium leading-none">{item.label}</div>
                              <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                                {item.description}
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}

              {/* Contacto - direct link */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#contacto"
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  )}
                >
                  Contacto
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setCartOpen(true)}
              aria-label={`Carrito de compras${itemCount > 0 ? ` (${itemCount} productos)` : ""}`}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Button>

            {/* CTA Button - Hacete Amigo */}
            <Button
              className="hidden md:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              asChild
            >
              <a href="#amigo">
                <Heart className="h-4 w-4" />
                Hacete Amigo
              </a>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 space-y-1 border-t border-border max-h-[calc(100vh-5rem)] overflow-y-auto">
            {Object.entries(menuItems).map(([key, menu]) => (
              <div key={key} className="border-b border-border/50 last:border-0">
                <button
                  onClick={() => toggleMobileSubmenu(key)}
                  className="flex items-center justify-between w-full py-3 text-left text-base font-medium hover:text-accent transition-colors"
                >
                  {menu.label}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      openMobileMenu === key && "rotate-180"
                    )}
                  />
                </button>
                {openMobileMenu === key && (
                  <div className="pb-3 pl-4 space-y-2">
                    {menu.items.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Contacto */}
            <a
              href="#contacto"
              className="block py-3 text-base font-medium hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </a>

            {/* CTA Button Mobile */}
            <div className="pt-4">
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                onClick={() => setIsMenuOpen(false)}
                asChild
              >
                <a href="#amigo">
                  <Heart className="h-4 w-4" />
                  Hacete Amigo
                </a>
              </Button>
            </div>
          </nav>
        )}

        <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
      </div>
    </header>
  )
}


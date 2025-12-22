import { useState } from "react"
import { Menu, X, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">CR</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Casa Ramayon</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#events" className="text-sm tracking-wide hover:text-accent transition-colors">
              Eventos
            </a>
            <a href="#bookings" className="text-sm tracking-wide hover:text-accent transition-colors">
              Reservas
            </a>
            <a href="#shop" className="text-sm tracking-wide hover:text-accent transition-colors">
              Tienda
            </a>
            <a href="#about" className="text-sm tracking-wide hover:text-accent transition-colors">
              Acerca de
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Button>

            <Button className="hidden md:inline-flex bg-primary text-primary-foreground hover:bg-primary/90">
              Iniciar Sesión
            </Button>

            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-6 space-y-4 border-t border-border">
            <a
              href="#events"
              className="block text-lg hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Eventos
            </a>
            <a
              href="#bookings"
              className="block text-lg hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Reservas
            </a>
            <a
              href="#shop"
              className="block text-lg hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Tienda
            </a>
            <a
              href="#about"
              className="block text-lg hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Acerca de
            </a>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Iniciar Sesión</Button>
          </nav>
        )}
      </div>
    </header>
  )
}

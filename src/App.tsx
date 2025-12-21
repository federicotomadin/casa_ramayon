import { Header } from "./components/layout/Header"
import { Hero } from "./components/sections/Hero"
import { EventsSection } from "./components/sections/EventsSection"
import { BookingSection } from "./components/sections/BookingSection"
import { ShopSection } from "./components/sections/ShopSection"
import { Footer } from "./components/layout/Footer"

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <EventsSection />
        <BookingSection />
        <ShopSection />
      </main>
      <Footer />
    </div>
  )
}

export default App

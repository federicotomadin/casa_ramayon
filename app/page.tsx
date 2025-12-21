import { Header } from "@/src/components/layout/Header"
import { Hero } from "@/src/components/sections/Hero"
import { EventsSection } from "@/src/components/sections/EventsSection"
import { BookingSection } from "@/src/components/sections/BookingSection"
import { ShopSection } from "@/src/components/sections/ShopSection"
import { Footer } from "@/src/components/layout/Footer"

export default function Page() {
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

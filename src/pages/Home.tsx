import { Header } from "@/components/layout/Header"
import { Hero } from "@/components/sections/Hero"
import { EventsSection } from "@/components/sections/EventsSection"
import { BookingSection } from "@/components/sections/BookingSection"
import { ShopSection } from "@/components/sections/ShopSection"
import { AmigoSection } from "@/components/sections/AmigoSection"
import { FAQSection } from "@/components/sections/FAQSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { Footer } from "@/components/layout/Footer"

export function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <EventsSection />
        <BookingSection />
        <ShopSection />
        <AmigoSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}

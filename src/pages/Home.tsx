import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { Header } from "@/components/layout/Header"
import { Hero } from "@/components/sections/Hero"
import { HistoriaSection } from "@/components/sections/HistoriaSection"
import { EspacioSection } from "@/components/sections/EspacioSection"
import { EventsSection } from "@/components/sections/EventsSection"
import { WorkshopsSection } from "@/components/sections/WorkshopsSection"
import { GuidedToursSection } from "@/components/sections/GuidedToursSection"
import { BookingSection } from "@/components/sections/BookingSection"
import { ShopSection } from "@/components/sections/ShopSection"
import { AmigoSection } from "@/components/sections/AmigoSection"
import { FAQSection } from "@/components/sections/FAQSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { Footer } from "@/components/layout/Footer"

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const payment = searchParams.get("payment")
    const type = searchParams.get("type")

    if (payment && type === "event") {
      if (payment === "success") {
        toast.success("¡Pago confirmado!", {
          description: "Vas a recibir un email con tu entrada y código QR.",
          duration: 8000,
        })
      } else if (payment === "failure") {
        toast.error("El pago no se pudo completar.", {
          description: "Podés intentar de nuevo desde la sección de eventos.",
          duration: 8000,
        })
      } else if (payment === "pending") {
        toast.info("Tu pago está pendiente.", {
          description:
            "Cuando se confirme, vas a recibir un email con tu entrada.",
          duration: 8000,
        })
      }
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <HistoriaSection />
        <EspacioSection />
        <EventsSection />
        <WorkshopsSection />
        <GuidedToursSection />
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

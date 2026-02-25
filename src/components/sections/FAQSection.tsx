import { useData } from "@/contexts/DataContext"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQSection() {
  const { faqs } = useData()
  const active = faqs.filter((f) => f.isActive).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  if (active.length === 0) return null

  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-3xl font-serif font-semibold text-center mb-12">
          Preguntas Frecuentes
        </h2>
        <Accordion type="single" collapsible className="max-w-3xl mx-auto space-y-2">
          {active.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="bg-background rounded-lg border px-4">
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground whitespace-pre-wrap">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail } from "lucide-react"

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_CONTACT_ID as string | undefined

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!FORMSPREE_ID) {
      setStatus("error")
      return
    }
    setStatus("loading")
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
      setStatus(res.ok ? "success" : "error")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="contacto" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold mb-4">Contacto</h2>
          <p className="text-muted-foreground">Escribinos y te respondemos a la brevedad</p>
        </div>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <Input name="name" placeholder="Nombre" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Textarea name="message" placeholder="Mensaje" rows={4} required />
          <Button type="submit" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? "Enviando…" : <><Mail className="mr-2 h-4 w-4" />Enviar</>}
          </Button>
          {status === "success" && <p className="text-sm text-green-600">¡Mensaje enviado!</p>}
          {status === "error" && <p className="text-sm text-destructive">Error al enviar.</p>}
        </form>
      </div>
    </section>
  )
}

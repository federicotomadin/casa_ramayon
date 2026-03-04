import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, User, Ticket, Calendar, MapPin } from "lucide-react"
import { getCallable } from "@/lib/firebase"
import type { Event } from "@/types"

const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin

interface EventRegistrationModalProps {
  event: Event | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EventRegistrationModal({
  event,
  open,
  onOpenChange,
}: EventRegistrationModalProps) {
  const [email, setEmail] = useState("")
  const [nombre, setNombre] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setError("Por favor ingresá un email válido.")
      return
    }

    if (!event) return

    setLoading(true)
    try {
      const createCheckout = getCallable<
        {
          email: string
          nombre: string
          eventoId: string
          eventTitle: string
          eventPrice: string
          eventImage?: string
          siteUrl: string
        },
        { initPoint: string }
      >("createEventCheckout")

      const { data } = await createCheckout({
        email: trimmedEmail,
        nombre: nombre.trim(),
        eventoId: event.id,
        eventTitle: event.title,
        eventPrice: event.price,
        eventImage: event.image || undefined,
        siteUrl: SITE_URL,
      })

      if (data?.initPoint) {
        window.location.href = data.initPoint
      }
    } catch (err) {
      console.error("Event checkout error:", err)
      setError(
        (err as Error)?.message || "Error al iniciar el pago. Intentá de nuevo."
      )
      setLoading(false)
    }
  }

  const handleOpenChange = (value: boolean) => {
    if (!loading) {
      setEmail("")
      setNombre("")
      setError("")
      onOpenChange(value)
    }
  }

  if (!event) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Reservar Entrada
          </DialogTitle>
          <DialogDescription>
            Completá tus datos para reservar tu entrada al evento.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
          <h4 className="font-medium text-base">{event.title}</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{event.date}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{event.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Ticket className="h-3.5 w-3.5" />
            <span>{event.price}</span>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reg-nombre" className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Nombre
            </Label>
            <Input
              id="reg-nombre"
              placeholder="Tu nombre (opcional)"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-email" className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reg-email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Pagar con Mercado Pago
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Al continuar, recibirás un email con tu entrada y código QR tras
            confirmar el pago.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}

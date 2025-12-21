"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Users, Clock } from "lucide-react"

export function BookingSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    guests: "2",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Booking submitted:", formData)
  }

  return (
    <section id="bookings" className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
              Reserva tu <span className="italic">mesa</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Experimenta nuestro espacio cultural con asientos reservados para exposiciones, espectáculos y talleres.
              Disfruta de un ambiente íntimo diseñado para entusiastas del arte.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Programación Flexible</h3>
                  <p className="text-muted-foreground">Elige tu fecha y hora preferidas para cualquier evento</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Reservas Grupales</h3>
                  <p className="text-muted-foreground">Reserva espacio para reuniones íntimas o grupos más grandes</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Confirmación Inmediata</h3>
                  <p className="text-muted-foreground">
                    Recibe confirmación de reserva inmediata por correo electrónico
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-light">Hacer una Reserva</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ingresa tu nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Fecha</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Hora</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="mt-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="guests">Número de Invitados</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="mt-2"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Confirmar Reserva
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

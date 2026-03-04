// Event types
export interface Event {
  id: string
  title: string
  date: string
  location: string
  price: string
  image: string
  category: EventCategory
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type EventCategory = "Exposición" | "Espectáculo" | "Taller"

// Product types
export interface Product {
  id: string
  name: string
  price: string
  image: string
  category: ProductCategory
  description?: string
  stock?: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type ProductCategory = "Pintura" | "Herramientas" | "Lienzo" | "Accesorios" | "Merch" | "Libros" | "Vinos" | "Yerbas"

// Page content types (for static pages like Historia, El Espacio, Equipo)
export interface PageContent {
  id: string
  slug: PageSlug
  title: string
  subtitle?: string
  content: string
  image?: string
  gallery?: string[]
  isActive: boolean
  updatedAt: Date
}

export type PageSlug = "historia" | "espacio" | "equipo" | "contacto" | "amigo"

// Workshop types (Talleres y Formación)
export interface Workshop {
  id: string
  title: string
  instructor: string
  description: string
  date: string
  duration: string
  price: string
  capacity: number
  image: string
  category: WorkshopCategory
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type WorkshopCategory = "Arte" | "Música" | "Danza" | "Literatura" | "Fotografía" | "Otro"

// Guided Tour types (Visitas Guiadas)
export interface GuidedTour {
  id: string
  title: string
  description: string
  schedule: string
  duration: string
  price: string
  capacity: number
  image: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Membership types (Hacete Amigo)
export interface Membership {
  id: string
  name: string
  price: string
  period: "mensual" | "anual"
  description?: string
  benefits: string[]
  featured: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Sponsor types
export interface Sponsor {
  id: string
  name: string
  logo: string
  website?: string
  tier: SponsorTier
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type SponsorTier = "Principal" | "Colaborador" | "Amigo"

// Newsletter Subscriber type
export interface Subscriber {
  id: string
  email: string
  createdAt: Date
}

// Team Member type (for Equipo page)
export interface TeamMember {
  id: string
  name: string
  role: string
  bio?: string
  image: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// FAQ types
export interface Faq {
  id: string
  question: string
  answer: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Ticket (Entrada) types
export interface Entrada {
  id: string
  email: string
  nombre?: string
  eventoId: string
  eventoTitle: string
  estado: "pending" | "complete"
  qrToken: string
  fechaCompra: Date
  fechaIngreso: Date | null
}

// Form types for creating/editing
export type EventFormData = Omit<Event, "id" | "createdAt" | "updatedAt">
export type ProductFormData = Omit<Product, "id" | "createdAt" | "updatedAt">
export type PageContentFormData = Omit<PageContent, "id" | "updatedAt">
export type WorkshopFormData = Omit<Workshop, "id" | "createdAt" | "updatedAt">
export type GuidedTourFormData = Omit<GuidedTour, "id" | "createdAt" | "updatedAt">
export type MembershipFormData = Omit<Membership, "id" | "createdAt" | "updatedAt">
export type SponsorFormData = Omit<Sponsor, "id" | "createdAt" | "updatedAt">
export type TeamMemberFormData = Omit<TeamMember, "id" | "createdAt" | "updatedAt">
export type FaqFormData = Omit<Faq, "id" | "createdAt" | "updatedAt">

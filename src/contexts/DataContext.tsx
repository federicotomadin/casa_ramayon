import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary"
import {
  Event,
  Product,
  Workshop,
  GuidedTour,
  Membership,
  Sponsor,
  TeamMember,
  PageContent,
  Subscriber,
  Faq,
  EventFormData,
  ProductFormData,
  WorkshopFormData,
  GuidedTourFormData,
  MembershipFormData,
  SponsorFormData,
  TeamMemberFormData,
  PageContentFormData,
  FaqFormData,
} from "@/types"

const defaultEvents: Event[] = []
const defaultProducts: Product[] = []
const defaultWorkshops: Workshop[] = []
const defaultGuidedTours: GuidedTour[] = []
const defaultMemberships: Membership[] = []
const defaultSponsors: Sponsor[] = []
const defaultFaqs: Faq[] = []
const defaultSubscribers: Subscriber[] = []
const defaultTeamMembers: TeamMember[] = []
const defaultPages: PageContent[] = []

interface DataContextType {
  events: Event[]
  products: Product[]
  workshops: Workshop[]
  guidedTours: GuidedTour[]
  memberships: Membership[]
  sponsors: Sponsor[]
  teamMembers: TeamMember[] 
  pages: PageContent[]
  faqs: Faq[]
  subscribers: Subscriber[]
  loading: boolean
  useLocalStorage: boolean

  addSubscriber: (email: string) => Promise<void>
  deleteSubscriber: (id: string) => Promise<void>
  addEvent: (data: EventFormData) => Promise<void>
  updateEvent: (id: string, data: Partial<EventFormData>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  addProduct: (data: ProductFormData) => Promise<void>
  updateProduct: (id: string, data: Partial<ProductFormData>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  addWorkshop: (data: WorkshopFormData) => Promise<void>
  updateWorkshop: (id: string, data: Partial<WorkshopFormData>) => Promise<void>
  deleteWorkshop: (id: string) => Promise<void>
  addGuidedTour: (data: GuidedTourFormData) => Promise<void>
  updateGuidedTour: (id: string, data: Partial<GuidedTourFormData>) => Promise<void>
  deleteGuidedTour: (id: string) => Promise<void>
  addMembership: (data: MembershipFormData) => Promise<void>
  updateMembership: (id: string, data: Partial<MembershipFormData>) => Promise<void>
  deleteMembership: (id: string) => Promise<void>
  addSponsor: (data: SponsorFormData) => Promise<void>
  updateSponsor: (id: string, data: Partial<SponsorFormData>) => Promise<void>
  deleteSponsor: (id: string) => Promise<void>
  addTeamMember: (data: TeamMemberFormData) => Promise<void>
  updateTeamMember: (id: string, data: Partial<TeamMemberFormData>) => Promise<void>
  deleteTeamMember: (id: string) => Promise<void>
  updatePage: (slug: string, data: Partial<PageContentFormData>) => Promise<void>
  addFaq: (data: FaqFormData) => Promise<void>
  updateFaq: (id: string, data: Partial<FaqFormData>) => Promise<void>
  deleteFaq: (id: string) => Promise<void>
  uploadImage: (file: File, folder: string) => Promise<string>
  deleteImage: (url: string) => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const isFirebaseConfigured = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
  return apiKey && apiKey !== "your-api-key"
}

const STORAGE_KEYS = {
  events: "casa_ramayon_events",
  products: "casa_ramayon_products",
  workshops: "casa_ramayon_workshops",
  guidedTours: "casa_ramayon_guided_tours",
  memberships: "casa_ramayon_memberships",
  sponsors: "casa_ramayon_sponsors",
  teamMembers: "casa_ramayon_team_members",
  pages: "casa_ramayon_pages",
  faqs: "casa_ramayon_faqs",
  subscribers: "casa_ramayon_subscribers",
}

const loadFromLocalStorage = <T,>(key: string, defaultValue: T[]): T[] => {
  try {
    const stored = localStorage.getItem(key)
    if (stored) return JSON.parse(stored)
  } catch {}
  return defaultValue
}

const saveToLocalStorage = <T,>(key: string, data: T[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {}
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [guidedTours, setGuidedTours] = useState<GuidedTour[]>([])
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [pages, setPages] = useState<PageContent[]>([])
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [useLocalStorage] = useState(!isFirebaseConfigured())

  useEffect(() => {
    if (useLocalStorage) {
      setEvents(loadFromLocalStorage(STORAGE_KEYS.events, defaultEvents))
      setProducts(loadFromLocalStorage(STORAGE_KEYS.products, defaultProducts))
      setWorkshops(loadFromLocalStorage(STORAGE_KEYS.workshops, defaultWorkshops))
      setGuidedTours(loadFromLocalStorage(STORAGE_KEYS.guidedTours, defaultGuidedTours))
      setMemberships(loadFromLocalStorage(STORAGE_KEYS.memberships, defaultMemberships))
      setSponsors(loadFromLocalStorage(STORAGE_KEYS.sponsors, defaultSponsors))
      setTeamMembers(loadFromLocalStorage(STORAGE_KEYS.teamMembers, defaultTeamMembers))
      setPages(loadFromLocalStorage(STORAGE_KEYS.pages, defaultPages))
      setFaqs(loadFromLocalStorage(STORAGE_KEYS.faqs, defaultFaqs))
      setSubscribers(loadFromLocalStorage(STORAGE_KEYS.subscribers, defaultSubscribers))
      setLoading(false)
    } else {
      const unsubscribers: (() => void)[] = []
      const subscribeToCollection = <T,>(
        collectionName: string,
        _storageKey: string,
        setter: React.Dispatch<React.SetStateAction<T[]>>,
        defaultData: T[]
      ) =>
        onSnapshot(
          collection(db, collectionName),
          (snapshot) => {
            const data = snapshot.docs.map((d) => ({
              id: d.id,
              ...d.data(),
              createdAt: d.data().createdAt?.toDate?.() || new Date(),
              updatedAt: d.data().updatedAt?.toDate?.() || new Date(),
            })) as T[]
            setter(data)
          },
          (err) => {
            console.warn(`Firestore: ${collectionName} not accessible, using empty default.`, err.message)
            setter(defaultData)
          }
        )
      unsubscribers.push(subscribeToCollection("events", STORAGE_KEYS.events, setEvents, defaultEvents))
      unsubscribers.push(subscribeToCollection("products", STORAGE_KEYS.products, setProducts, defaultProducts))
      unsubscribers.push(subscribeToCollection("workshops", STORAGE_KEYS.workshops, setWorkshops, defaultWorkshops))
      unsubscribers.push(subscribeToCollection("guidedTours", STORAGE_KEYS.guidedTours, setGuidedTours, defaultGuidedTours))
      unsubscribers.push(subscribeToCollection("memberships", STORAGE_KEYS.memberships, setMemberships, defaultMemberships))
      unsubscribers.push(subscribeToCollection("sponsors", STORAGE_KEYS.sponsors, setSponsors, defaultSponsors))
      unsubscribers.push(subscribeToCollection("teamMembers", STORAGE_KEYS.teamMembers, setTeamMembers, defaultTeamMembers))
      unsubscribers.push(subscribeToCollection("pages", STORAGE_KEYS.pages, setPages, defaultPages))
      unsubscribers.push(subscribeToCollection("faqs", STORAGE_KEYS.faqs, setFaqs, defaultFaqs))
      unsubscribers.push(subscribeToCollection("subscribers", STORAGE_KEYS.subscribers, setSubscribers, defaultSubscribers))
      setTimeout(() => setLoading(false), 2000)
      return () => unsubscribers.forEach((u) => u())
    }
  }, [useLocalStorage])

  const createItem = async (
    col: string,
    key: string,
    data: any,
    items: any[],
    setItems: (x: any) => void
  ) => {
    const item = { ...data, createdAt: new Date(), updatedAt: new Date() }
    if (useLocalStorage) {
      const id = Date.now().toString()
      const next = [...items, { ...item, id }]
      setItems(next)
      saveToLocalStorage(key, next)
    } else {
      await addDoc(collection(db, col), { ...item, createdAt: Timestamp.now(), updatedAt: Timestamp.now() })
    }
  }

  const updateItem = async (
    col: string,
    key: string,
    id: string,
    data: any,
    items: any[],
    setItems: (x: any) => void
  ) => {
    const updateData = { ...data, updatedAt: new Date() }
    if (useLocalStorage) {
      const next = items.map((i: any) => (i.id === id ? { ...i, ...updateData } : i))
      setItems(next)
      saveToLocalStorage(key, next)
    } else {
      await updateDoc(doc(db, col, id), { ...updateData, updatedAt: Timestamp.now() })
    }
  }

  const deleteItem = async (
    col: string,
    key: string,
    id: string,
    items: any[],
    setItems: (x: any) => void
  ) => {
    if (useLocalStorage) {
      const next = items.filter((i: any) => i.id !== id)
      setItems(next)
      saveToLocalStorage(key, next)
    } else {
      await deleteDoc(doc(db, col, id))
    }
  }

  const addEvent = (d: EventFormData) => createItem("events", STORAGE_KEYS.events, d, events, setEvents)
  const updateEvent = (id: string, d: Partial<EventFormData>) => updateItem("events", STORAGE_KEYS.events, id, d, events, setEvents)
  const deleteEvent = (id: string) => deleteItem("events", STORAGE_KEYS.events, id, events, setEvents)

  const addProduct = (d: ProductFormData) => createItem("products", STORAGE_KEYS.products, d, products, setProducts)
  const updateProduct = (id: string, d: Partial<ProductFormData>) => updateItem("products", STORAGE_KEYS.products, id, d, products, setProducts)
  const deleteProduct = (id: string) => deleteItem("products", STORAGE_KEYS.products, id, products, setProducts)

  const addWorkshop = (d: WorkshopFormData) => createItem("workshops", STORAGE_KEYS.workshops, d, workshops, setWorkshops)
  const updateWorkshop = (id: string, d: Partial<WorkshopFormData>) => updateItem("workshops", STORAGE_KEYS.workshops, id, d, workshops, setWorkshops)
  const deleteWorkshop = (id: string) => deleteItem("workshops", STORAGE_KEYS.workshops, id, workshops, setWorkshops)

  const addGuidedTour = (d: GuidedTourFormData) => createItem("guidedTours", STORAGE_KEYS.guidedTours, d, guidedTours, setGuidedTours)
  const updateGuidedTour = (id: string, d: Partial<GuidedTourFormData>) => updateItem("guidedTours", STORAGE_KEYS.guidedTours, id, d, guidedTours, setGuidedTours)
  const deleteGuidedTour = (id: string) => deleteItem("guidedTours", STORAGE_KEYS.guidedTours, id, guidedTours, setGuidedTours)

  const addMembership = (d: MembershipFormData) => createItem("memberships", STORAGE_KEYS.memberships, d, memberships, setMemberships)
  const updateMembership = (id: string, d: Partial<MembershipFormData>) => updateItem("memberships", STORAGE_KEYS.memberships, id, d, memberships, setMemberships)
  const deleteMembership = (id: string) => deleteItem("memberships", STORAGE_KEYS.memberships, id, memberships, setMemberships)

  const addSponsor = (d: SponsorFormData) => createItem("sponsors", STORAGE_KEYS.sponsors, d, sponsors, setSponsors)
  const updateSponsor = (id: string, d: Partial<SponsorFormData>) => updateItem("sponsors", STORAGE_KEYS.sponsors, id, d, sponsors, setSponsors)
  const deleteSponsor = (id: string) => deleteItem("sponsors", STORAGE_KEYS.sponsors, id, sponsors, setSponsors)

  const addTeamMember = (d: TeamMemberFormData) => createItem("teamMembers", STORAGE_KEYS.teamMembers, d, teamMembers, setTeamMembers)
  const updateTeamMember = (id: string, d: Partial<TeamMemberFormData>) => updateItem("teamMembers", STORAGE_KEYS.teamMembers, id, d, teamMembers, setTeamMembers)
  const deleteTeamMember = (id: string) => deleteItem("teamMembers", STORAGE_KEYS.teamMembers, id, teamMembers, setTeamMembers)

  const addFaq = (d: FaqFormData) => createItem("faqs", STORAGE_KEYS.faqs, d, faqs, setFaqs)
  const updateFaq = (id: string, d: Partial<FaqFormData>) => updateItem("faqs", STORAGE_KEYS.faqs, id, d, faqs, setFaqs)
  const deleteFaq = (id: string) => deleteItem("faqs", STORAGE_KEYS.faqs, id, faqs, setFaqs)

  const addSubscriber = async (email: string) => {
    const normalized = email.trim().toLowerCase()
    if (!normalized) throw new Error("Email inválido")
    if (subscribers.some((s) => s.email.toLowerCase() === normalized)) throw new Error("Este email ya está suscrito")
    await createItem("subscribers", STORAGE_KEYS.subscribers, { email: normalized }, subscribers, setSubscribers)
  }
  const deleteSubscriber = (id: string) => deleteItem("subscribers", STORAGE_KEYS.subscribers, id, subscribers, setSubscribers)

  const updatePage = async (slug: string, data: Partial<PageContentFormData>) => {
    const updateData = { ...data, updatedAt: new Date() }
    if (useLocalStorage) {
      const page = pages.find((p) => p.slug === slug)
      const next = page
        ? pages.map((p) => (p.slug === slug ? { ...p, ...updateData } : p))
        : [...pages, { id: slug, slug: slug as PageContent["slug"], title: data.title ?? "", content: data.content ?? "", isActive: true, ...updateData }]
      setPages(next)
      saveToLocalStorage(STORAGE_KEYS.pages, next)
    } else {
      const page = pages.find((p) => p.slug === slug)
      if (page) {
        await updateDoc(doc(db, "pages", page.id), { ...updateData, updatedAt: Timestamp.now() })
      } else {
        await addDoc(collection(db, "pages"), { slug, ...updateData, updatedAt: Timestamp.now() })
      }
    }
  }

  const uploadImage = async (file: File, folder: string): Promise<string> => {
    if (!isCloudinaryConfigured()) {
      throw new Error("Cloudinary no configurado. Ver Configuración.")
    }
    return uploadToCloudinary(file, folder)
  }
  const deleteImage = async (_url: string) => {}

  return (
    <DataContext.Provider
      value={{
        events,
        products,
        workshops,
        guidedTours,
        memberships,
        sponsors,
        teamMembers,
        pages,
        faqs,
        subscribers,
        loading,
        useLocalStorage,
        addSubscriber,
        deleteSubscriber,
        addEvent,
        updateEvent,
        deleteEvent,
        addProduct,
        updateProduct,
        deleteProduct,
        addWorkshop,
        updateWorkshop,
        deleteWorkshop,
        addGuidedTour,
        updateGuidedTour,
        deleteGuidedTour,
        addMembership,
        updateMembership,
        deleteMembership,
        addSponsor,
        updateSponsor,
        deleteSponsor,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        updatePage,
        addFaq,
        updateFaq,
        deleteFaq,
        uploadImage,
        deleteImage,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (ctx === undefined) throw new Error("useData must be used within a DataProvider")
  return ctx
}

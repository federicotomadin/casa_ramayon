import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { User, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const isFirebaseConfigured = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
  return apiKey && apiKey !== "your-api-key"
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false)
      return
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!isFirebaseConfigured()) {
      throw new Error("Firebase no está configurado. Usá el modo demo.")
    }
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signOut = async () => {
    if (isFirebaseConfigured()) {
      await firebaseSignOut(auth)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

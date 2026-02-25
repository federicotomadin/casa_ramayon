import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock } from "lucide-react"

export function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [useDemoMode, setUseDemoMode] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await signIn(email, password)
      navigate("/panel")
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code
      setError(code === "auth/invalid-credential" ? "Credenciales inválidas" : "Error al iniciar sesión.")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoAccess = () => {
    localStorage.setItem("casa_ramayon_demo_auth", "true")
    navigate("/panel")
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Panel de Administración</CardTitle>
          <CardDescription>Casa Ramayon</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!useDemoMode ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="admin@casaramayon.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Iniciar Sesión
                </Button>
              </form>
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground text-center mb-3">¿Sin Firebase configurado?</p>
                <Button variant="outline" className="w-full" onClick={() => setUseDemoMode(true)}>Modo Demo</Button>
              </div>
            </>
          ) : (
            <>
              <Alert className="mb-4"><AlertDescription>Modo demo usa localStorage.</AlertDescription></Alert>
              <Button className="w-full mb-2" onClick={handleDemoAccess}>Acceder al Panel</Button>
              <Button variant="outline" className="w-full" onClick={() => setUseDemoMode(false)}>Volver</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

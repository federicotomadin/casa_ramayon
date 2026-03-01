import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/contexts/DataContext"
import { isCloudinaryConfigured } from "@/lib/cloudinary"
import { CheckCircle2, XCircle, Database, Cloud, CreditCard, Image } from "lucide-react"

function StatusItem({ label, configured, detail }: { label: string; configured: boolean; detail?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div>
        <p className="font-medium">{label}</p>
        {detail && <p className="text-sm text-muted-foreground">{detail}</p>}
      </div>
      <Badge variant={configured ? "default" : "destructive"} className="gap-1">
        {configured ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
        {configured ? "Configurado" : "No configurado"}
      </Badge>
    </div>
  )
}

export function AdminSettings() {
  const { useLocalStorage } = useData()
  const firebaseConfigured = !useLocalStorage
  const cloudinaryConfigured = isCloudinaryConfigured()
  const mpConfigured = Boolean(import.meta.env.VITE_SITE_URL)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Configuración</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" /> Estado de los Servicios</CardTitle>
        </CardHeader>
        <CardContent>
          <StatusItem
            label="Firebase / Firestore"
            configured={firebaseConfigured}
            detail={firebaseConfigured ? "Conectado a Firestore" : "Usando localStorage como fallback"}
          />
          <StatusItem
            label="Cloudinary (Imágenes)"
            configured={cloudinaryConfigured}
            detail={cloudinaryConfigured ? `Cloud: ${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}` : "Configurar VITE_CLOUDINARY_CLOUD_NAME en .env"}
          />
          <StatusItem
            label="Mercado Pago"
            configured={mpConfigured}
            detail="El Access Token se configura en Firebase Functions Secrets"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Cloud className="h-5 w-5" /> Variables de Entorno</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm font-mono">
          <p><span className="text-muted-foreground">VITE_FIREBASE_PROJECT_ID=</span>{import.meta.env.VITE_FIREBASE_PROJECT_ID || <span className="text-destructive">no configurado</span>}</p>
          <p><span className="text-muted-foreground">VITE_CLOUDINARY_CLOUD_NAME=</span>{import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || <span className="text-destructive">no configurado</span>}</p>
          <p><span className="text-muted-foreground">VITE_SITE_URL=</span>{import.meta.env.VITE_SITE_URL || <span className="text-destructive">no configurado</span>}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Mercado Pago</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>El token de Mercado Pago se gestiona como secret de Firebase Functions.</p>
          <p className="font-mono bg-muted p-2 rounded">firebase functions:secrets:set MERCADOPAGO_ACCESS_TOKEN</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Image className="h-5 w-5" /> Cloudinary</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Las imágenes se suben a Cloudinary. Configurá las variables en el archivo <code>.env</code>:</p>
          <div className="font-mono bg-muted p-2 rounded space-y-1">
            <p>VITE_CLOUDINARY_CLOUD_NAME=tu-cloud-name</p>
            <p>VITE_CLOUDINARY_UPLOAD_PRESET=casa_ramayon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

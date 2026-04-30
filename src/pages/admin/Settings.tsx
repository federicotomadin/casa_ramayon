import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/contexts/DataContext"
import { isCloudinaryConfigured } from "@/lib/cloudinary"
import { toast } from "sonner"
import {
  CheckCircle2,
  XCircle,
  Database,
  Cloud,
  CreditCard,
  Image as ImageIcon,
  ImagePlus,
  Loader2,
  Trash2,
  Wallpaper,
} from "lucide-react"

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
  const { useLocalStorage, siteSettings, updateSiteSettings, uploadImage } = useData()
  const firebaseConfigured = !useLocalStorage
  const cloudinaryConfigured = isCloudinaryConfigured()
  const mpConfigured = Boolean(import.meta.env.VITE_SITE_URL)

  const logoInputRef = useRef<HTMLInputElement>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [removingLogo, setRemovingLogo] = useState(false)

  const heroBgInputRef = useRef<HTMLInputElement>(null)
  const [uploadingHeroBg, setUploadingHeroBg] = useState(false)
  const [removingHeroBg, setRemovingHeroBg] = useState(false)
  const defaultHeroBg = `${import.meta.env.BASE_URL}casa_ramayon.png`

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingLogo(true)
      const url = await uploadImage(file, "site/logo")
      await updateSiteSettings({ logoUrl: url })
      toast.success("Logo actualizado")
    } catch (err) {
      toast.error((err as Error)?.message || "Error al subir el logo")
    } finally {
      setUploadingLogo(false)
      if (logoInputRef.current) logoInputRef.current.value = ""
    }
  }

  const handleRemoveLogo = async () => {
    try {
      setRemovingLogo(true)
      await updateSiteSettings({ logoUrl: "" })
      toast.success("Logo eliminado")
    } catch (err) {
      toast.error((err as Error)?.message || "Error al eliminar el logo")
    } finally {
      setRemovingLogo(false)
    }
  }

  const handleHeroBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingHeroBg(true)
      const url = await uploadImage(file, "site/hero")
      await updateSiteSettings({ heroBackgroundUrl: url })
      toast.success("Imagen de fondo actualizada")
    } catch (err) {
      toast.error((err as Error)?.message || "Error al subir la imagen")
    } finally {
      setUploadingHeroBg(false)
      if (heroBgInputRef.current) heroBgInputRef.current.value = ""
    }
  }

  const handleRemoveHeroBg = async () => {
    try {
      setRemovingHeroBg(true)
      await updateSiteSettings({ heroBackgroundUrl: "" })
      toast.success("Imagen de fondo restablecida")
    } catch (err) {
      toast.error((err as Error)?.message || "Error al eliminar la imagen")
    } finally {
      setRemovingHeroBg(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Configuración</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Logo del sitio</CardTitle>
          <p className="text-sm text-muted-foreground">
            Esta imagen reemplaza el círculo con "CR" en el encabezado del sitio público. Se recomienda una imagen cuadrada
            (por ejemplo 200×200px), en formato PNG con fondo transparente.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {siteSettings?.logoUrl ? (
              <div className="relative group">
                <img
                  src={siteSettings.logoUrl}
                  alt="Logo actual"
                  className="h-20 w-20 rounded-full object-contain border bg-background"
                />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-bold text-2xl">CR</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploadingLogo || !cloudinaryConfigured}
                onClick={() => logoInputRef.current?.click()}
              >
                {uploadingLogo ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Subiendo...</>
                ) : (
                  <><ImagePlus className="mr-2 h-4 w-4" /> {siteSettings?.logoUrl ? "Cambiar logo" : "Subir logo"}</>
                )}
              </Button>

              {siteSettings?.logoUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  disabled={removingLogo}
                  onClick={handleRemoveLogo}
                >
                  {removingLogo ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Quitar logo
                </Button>
              )}
            </div>
          </div>

          {!cloudinaryConfigured && (
            <p className="text-xs text-destructive mt-3">
              Cloudinary no está configurado. Configurá las variables de entorno para poder subir imágenes.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wallpaper className="h-5 w-5" /> Imagen de fondo (Hero)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Imagen que se muestra de fondo en la portada principal ("Arte con Historia"). Se recomienda una imagen
            horizontal en alta calidad (por ejemplo 1920×1080). Si no subís ninguna, se usa la imagen por defecto del sitio.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative w-full max-w-xl aspect-video rounded-lg overflow-hidden border bg-muted">
              <img
                src={siteSettings?.heroBackgroundUrl || defaultHeroBg}
                alt="Fondo de la portada"
                className="w-full h-full object-cover"
              />
              {!siteSettings?.heroBackgroundUrl && (
                <span className="absolute top-2 left-2 text-xs bg-background/90 px-2 py-1 rounded">
                  Imagen por defecto
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={heroBgInputRef}
                type="file"
                accept="image/*"
                onChange={handleHeroBgUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploadingHeroBg || !cloudinaryConfigured}
                onClick={() => heroBgInputRef.current?.click()}
              >
                {uploadingHeroBg ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Subiendo...</>
                ) : (
                  <><ImagePlus className="mr-2 h-4 w-4" /> {siteSettings?.heroBackgroundUrl ? "Cambiar imagen" : "Subir imagen"}</>
                )}
              </Button>

              {siteSettings?.heroBackgroundUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  disabled={removingHeroBg}
                  onClick={handleRemoveHeroBg}
                >
                  {removingHeroBg ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Usar imagen por defecto
                </Button>
              )}
            </div>

            {!cloudinaryConfigured && (
              <p className="text-xs text-destructive">
                Cloudinary no está configurado. Configurá las variables de entorno para poder subir imágenes.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

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
          <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Cloudinary</CardTitle>
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

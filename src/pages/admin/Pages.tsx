import { useState, useRef } from "react"
import { useData } from "@/contexts/DataContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Save, FileText, ImagePlus, Trash2 } from "lucide-react"
import type { PageSlug } from "@/types"

const PAGE_SLUGS: { slug: PageSlug; label: string; description: string }[] = [
  { slug: "historia", label: "Historia", description: "Sección 'Nuestra Historia' de la página principal" },
  { slug: "espacio", label: "El Espacio", description: "Sección 'El Espacio' de la página principal" },
  { slug: "equipo", label: "Equipo", description: "Información del equipo" },
  { slug: "contacto", label: "Contacto", description: "Datos de contacto" },
  { slug: "amigo", label: "Hacete Amigo", description: "Texto de la sección de membresías" },
]

export function AdminPages() {
  const { pages, updatePage, uploadImage } = useData()
  const [activeSlug, setActiveSlug] = useState<PageSlug>("historia")
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [content, setContent] = useState("")
  const [image, setImage] = useState("")
  const [gallery, setGallery] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [loaded, setLoaded] = useState<PageSlug | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const loadPage = (slug: PageSlug) => {
    setActiveSlug(slug)
    const page = pages.find((p) => p.slug === slug)
    setTitle(page?.title || "")
    setSubtitle(page?.subtitle || "")
    setContent(page?.content || "")
    setImage(page?.image || "")
    setGallery(page?.gallery || [])
    setLoaded(slug)
  }

  if (loaded !== activeSlug) {
    loadPage(activeSlug)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      const url = await uploadImage(file, `pages/${activeSlug}`)
      setImage(url)
      toast.success("Imagen subida")
    } catch {
      toast.error("Error al subir la imagen")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingGallery(true)
      const url = await uploadImage(file, `pages/${activeSlug}/gallery`)
      setGallery((prev) => [...prev, url])
      toast.success("Imagen agregada a la galería")
    } catch {
      toast.error("Error al subir la imagen")
    } finally {
      setUploadingGallery(false)
      if (galleryInputRef.current) galleryInputRef.current.value = ""
    }
  }

  const removeGalleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updatePage(activeSlug, {
        title,
        subtitle,
        content,
        image,
        gallery,
        slug: activeSlug,
        isActive: true,
      })
      toast.success("Página actualizada")
    } catch (err) {
      toast.error((err as Error)?.message || "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  const currentPageInfo = PAGE_SLUGS.find((p) => p.slug === activeSlug)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Páginas</h2>
      <div className="flex flex-wrap gap-2">
        {PAGE_SLUGS.map(({ slug, label }) => (
          <Button
            key={slug}
            variant={activeSlug === slug ? "default" : "outline"}
            onClick={() => loadPage(slug)}
          >
            <FileText className="h-4 w-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Editar: {currentPageInfo?.label}</CardTitle>
          {currentPageInfo?.description && (
            <p className="text-sm text-muted-foreground">{currentPageInfo.description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título de la sección" />
          </div>

          <div className="space-y-2">
            <Label>Subtítulo</Label>
            <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Subtítulo (opcional)" />
          </div>

          <div className="space-y-2">
            <Label>Contenido</Label>
            <p className="text-xs text-muted-foreground">Usá saltos de línea para separar párrafos</p>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Contenido de la página..."
              rows={10}
            />
          </div>

          <div className="space-y-2">
            <Label>Imagen principal</Label>
            <div className="flex items-center gap-4">
              {image ? (
                <div className="relative group">
                  <img src={image} alt="Preview" className="h-32 w-48 rounded-lg object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setImage("")}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="h-32 w-48 rounded-lg border-2 border-dashed flex items-center justify-center">
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Subiendo...</>
                  ) : (
                    <><ImagePlus className="mr-2 h-4 w-4" /> Subir imagen</>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {(activeSlug === "espacio" || activeSlug === "historia") && (
            <div className="space-y-2">
              <Label>Galería de imágenes</Label>
              <div className="flex flex-wrap gap-3">
                {gallery.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt={`Galería ${i + 1}`} className="h-24 w-24 rounded-lg object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeGalleryImage(i)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <div>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploadingGallery}
                    onClick={() => galleryInputRef.current?.click()}
                    className="h-24 w-24 rounded-lg border-2 border-dashed flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    {uploadingGallery ? (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    ) : (
                      <ImagePlus className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Guardar Cambios
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

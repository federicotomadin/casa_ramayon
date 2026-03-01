import { useState, useRef } from "react"
import { useData } from "@/contexts/DataContext"
import { Workshop, WorkshopCategory, WorkshopFormData } from "@/types"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Loader2, ImagePlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const CATEGORIES: WorkshopCategory[] = [
  "Arte",
  "Música",
  "Danza",
  "Literatura",
  "Fotografía",
  "Otro",
]

const emptyForm: WorkshopFormData = {
  title: "",
  instructor: "",
  description: "",
  date: "",
  duration: "",
  price: "",
  capacity: 0,
  image: "",
  category: "Arte",
  isActive: true,
}

export function AdminWorkshops() {
  const { workshops, addWorkshop, updateWorkshop, deleteWorkshop, uploadImage } =
    useData()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Workshop | null>(null)
  const [form, setForm] = useState<WorkshopFormData>({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm })
    setDialogOpen(true)
  }

  const openEdit = (workshop: Workshop) => {
    setEditing(workshop)
    setForm({
      title: workshop.title,
      instructor: workshop.instructor,
      description: workshop.description,
      date: workshop.date,
      duration: workshop.duration,
      price: workshop.price,
      capacity: workshop.capacity,
      image: workshop.image,
      category: workshop.category,
      isActive: workshop.isActive,
    })
    setDialogOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, "workshops")
      setForm((prev) => ({ ...prev, image: url }))
      toast.success("Imagen subida correctamente")
    } catch {
      toast.error("Error al subir la imagen")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.instructor.trim()) {
      toast.error("Título e instructor son obligatorios")
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await updateWorkshop(editing.id, form)
        toast.success("Taller actualizado")
      } else {
        await addWorkshop(form)
        toast.success("Taller creado")
      }
      setDialogOpen(false)
    } catch {
      toast.error("Error al guardar el taller")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteWorkshop(id)
      toast.success("Taller eliminado")
    } catch {
      toast.error("Error al eliminar el taller")
    }
  }

  const updateField = <K extends keyof WorkshopFormData>(
    key: K,
    value: WorkshopFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Talleres</h2>
          <p className="text-muted-foreground">
            Gestionar talleres y formación.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Taller
        </Button>
      </div>

      {workshops.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No hay talleres cargados.</p>
          <Button variant="link" onClick={openCreate}>
            Crear el primero
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Imagen</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead className="text-center">Capacidad</TableHead>
                <TableHead className="text-center">Activo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workshops.map((w) => (
                <TableRow key={w.id}>
                  <TableCell>
                    {w.image ? (
                      <img
                        src={w.image}
                        alt={w.title}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                        <ImagePlus className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{w.title}</TableCell>
                  <TableCell>{w.instructor}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{w.category}</Badge>
                  </TableCell>
                  <TableCell>{w.date}</TableCell>
                  <TableCell>{w.price}</TableCell>
                  <TableCell className="text-center">{w.capacity}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={w.isActive ? "default" : "outline"}>
                      {w.isActive ? "Sí" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(w)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              ¿Eliminar taller?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará
                              permanentemente &quot;{w.title}&quot;.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(w.id)}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar Taller" : "Nuevo Taller"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Nombre del taller"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                id="instructor"
                value={form.instructor}
                onChange={(e) => updateField("instructor", e.target.value)}
                placeholder="Nombre del instructor"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Descripción del taller"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => updateField("date", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duración</Label>
                <Input
                  id="duration"
                  value={form.duration}
                  onChange={(e) => updateField("duration", e.target.value)}
                  placeholder="Ej: 2 horas"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="Ej: $5.000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacidad</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={0}
                  value={form.capacity}
                  onChange={(e) =>
                    updateField("capacity", parseInt(e.target.value) || 0)
                  }
                  placeholder="Cantidad máxima"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  updateField("category", v as WorkshopCategory)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Imagen</Label>
              <div className="flex items-center gap-4">
                {form.image ? (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="h-20 w-20 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded border border-dashed">
                    <ImagePlus className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Subiendo…
                      </>
                    ) : (
                      "Subir imagen"
                    )}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  {form.image && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => updateField("image", "")}
                    >
                      Quitar imagen
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(checked) => updateField("isActive", checked)}
              />
              <Label htmlFor="isActive">Activo</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando…
                </>
              ) : editing ? (
                "Guardar cambios"
              ) : (
                "Crear taller"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

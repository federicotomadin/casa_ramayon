import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Membership, MembershipFormData } from "@/types";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/alert-dialog";

const EMPTY_FORM: MembershipFormData = {
  name: "",
  price: "",
  period: "mensual",
  description: "",
  benefits: [],
  featured: false,
  isActive: true,
};

function benefitsToText(benefits: string[]): string {
  return benefits.join("\n");
}

function textToBenefits(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function AdminMemberships() {
  const { memberships, addMembership, updateMembership, deleteMembership } =
    useData();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Membership | null>(null);
  const [form, setForm] = useState<MembershipFormData>({ ...EMPTY_FORM });
  const [benefitsText, setBenefitsText] = useState("");
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setBenefitsText("");
    setDialogOpen(true);
  }

  function openEdit(membership: Membership) {
    setEditing(membership);
    setForm({
      name: membership.name,
      price: membership.price,
      period: membership.period,
      description: membership.description ?? "",
      benefits: membership.benefits,
      featured: membership.featured,
      isActive: membership.isActive,
    });
    setBenefitsText(benefitsToText(membership.benefits));
    setDialogOpen(true);
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.price.trim()) {
      toast.error("El nombre y el precio son obligatorios");
      return;
    }
    setSaving(true);
    try {
      const data: MembershipFormData = {
        ...form,
        benefits: textToBenefits(benefitsText),
      };
      if (editing) {
        await updateMembership(editing.id, data);
        toast.success("Membresía actualizada");
      } else {
        await addMembership(data);
        toast.success("Membresía creada");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Error al guardar la membresía");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteMembership(id);
      toast.success("Membresía eliminada");
    } catch {
      toast.error("Error al eliminar la membresía");
    }
  }

  async function handleToggleActive(membership: Membership) {
    try {
      await updateMembership(membership.id, {
        isActive: !membership.isActive,
      });
    } catch {
      toast.error("Error al actualizar el estado");
    }
  }

  const updateField = <K extends keyof MembershipFormData>(
    key: K,
    value: MembershipFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (!memberships) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Membresías</h2>
          <p className="text-muted-foreground">
            Gestionar planes de membresía.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Membresía
        </Button>
      </div>

      {memberships.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            No hay membresías cargadas todavía.
          </p>
          <Button variant="link" onClick={openCreate}>
            Crear la primera
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Período</TableHead>
                <TableHead className="text-center">Beneficios</TableHead>
                <TableHead className="text-center">Destacada</TableHead>
                <TableHead className="text-center">Activo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberships.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>${m.price}</TableCell>
                  <TableCell>
                    <Badge variant={m.period === "anual" ? "default" : "secondary"}>
                      {m.period === "mensual" ? "Mensual" : "Anual"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {m.benefits.length}
                  </TableCell>
                  <TableCell className="text-center">
                    {m.featured ? (
                      <Star className="mx-auto h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={m.isActive}
                      onCheckedChange={() => handleToggleActive(m)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(m)}
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
                              ¿Eliminar membresía?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará
                              permanentemente &quot;{m.name}&quot;.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(m.id)}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar Membresía" : "Nueva Membresía"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Nombre de la membresía"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="period">Período</Label>
                <Select
                  value={form.period}
                  onValueChange={(v) =>
                    updateField("period", v as "mensual" | "anual")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensual">Mensual</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={form.description ?? ""}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Descripción de la membresía"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="benefits">Beneficios (uno por línea)</Label>
              <Textarea
                id="benefits"
                value={benefitsText}
                onChange={(e) => setBenefitsText(e.target.value)}
                placeholder={"Acceso ilimitado\nDescuentos exclusivos\nEventos VIP"}
                rows={4}
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="featured"
                checked={form.featured}
                onCheckedChange={(checked) => updateField("featured", checked)}
              />
              <Label htmlFor="featured">Destacada</Label>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(checked) => updateField("isActive", checked)}
              />
              <Label htmlFor="isActive">Activa</Label>
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
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando…
                </>
              ) : editing ? (
                "Guardar cambios"
              ) : (
                "Crear membresía"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle2,
  XCircle,
  Loader2,
  QrCode,
  Calendar,
  Mail,
  User,
  Ticket,
} from "lucide-react"

type ValidationState =
  | { status: "loading" }
  | { status: "no_token" }
  | { status: "confirmed"; entrada: EntradaDoc }
  | { status: "already_used"; entrada: EntradaDoc }
  | { status: "not_found" }
  | { status: "error"; message: string }

interface EntradaDoc {
  id: string
  email: string
  nombre?: string
  eventoId: string
  eventoTitle: string
  estado: "pending" | "complete"
  qrToken: string
  fechaCompra: Date | null
  fechaIngreso: Date | null
}

export function AdminValidateEntry() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const [state, setState] = useState<ValidationState>({ status: "loading" })
  const processed = useRef(false)

  useEffect(() => {
    if (!token) {
      setState({ status: "no_token" })
      return
    }

    if (processed.current) return
    processed.current = true

    const validateAndConfirm = async () => {
      setState({ status: "loading" })
      try {
        const q = query(
          collection(db, "entradas"),
          where("qrToken", "==", token)
        )
        const snapshot = await getDocs(q)

        if (snapshot.empty) {
          setState({ status: "not_found" })
          return
        }

        const docSnap = snapshot.docs[0]
        const data = docSnap.data()
        const entrada: EntradaDoc = {
          id: docSnap.id,
          email: data.email,
          nombre: data.nombre,
          eventoId: data.eventoId,
          eventoTitle: data.eventoTitle || "",
          estado: data.estado,
          qrToken: data.qrToken,
          fechaCompra: data.fechaCompra?.toDate?.() || null,
          fechaIngreso: data.fechaIngreso?.toDate?.() || null,
        }

        if (entrada.estado === "complete") {
          setState({ status: "already_used", entrada })
          return
        }

        await updateDoc(doc(db, "entradas", entrada.id), {
          estado: "complete",
          fechaIngreso: Timestamp.now(),
        })

        setState({
          status: "confirmed",
          entrada: {
            ...entrada,
            estado: "complete",
            fechaIngreso: new Date(),
          },
        })
      } catch (err) {
        console.error("Validation error:", err)
        setState({
          status: "error",
          message: "Error al validar la entrada. Intentá de nuevo.",
        })
      }
    }

    validateAndConfirm()
  }, [token])

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <QrCode className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Validar Entrada</CardTitle>
        </CardHeader>
        <CardContent>
          {state.status === "loading" && (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Validando entrada...</p>
            </div>
          )}

          {state.status === "no_token" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                No se proporcionó un token de entrada. Escaneá un código QR
                válido.
              </AlertDescription>
            </Alert>
          )}

          {state.status === "not_found" && (
            <div className="text-center py-6">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Entrada inválida
              </h3>
              <p className="text-muted-foreground">
                No se encontró ninguna entrada con este código QR.
              </p>
            </div>
          )}

          {state.status === "error" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          {state.status === "confirmed" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-600 mb-1">
                  Entrada válida
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ingreso registrado correctamente.
                </p>
              </div>

              <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {state.entrada.eventoTitle}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{state.entrada.email}</span>
                </div>
                {state.entrada.nombre && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{state.entrada.nombre}</span>
                  </div>
                )}
                {state.entrada.fechaCompra && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Compra:{" "}
                      {state.entrada.fechaCompra.toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Ingreso:{" "}
                    {new Date().toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {state.status === "already_used" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold text-destructive mb-1">
                  Entrada ya utilizada
                </h3>
                <p className="text-sm text-muted-foreground">
                  Esta entrada ya fue escaneada y no puede volver a usarse.
                </p>
              </div>

              <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {state.entrada.eventoTitle}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{state.entrada.email}</span>
                </div>
                {state.entrada.fechaIngreso && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Ingreso:{" "}
                      {state.entrada.fechaIngreso.toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

import { onCall, HttpsError } from "firebase-functions/v2/https"
import { defineSecret } from "firebase-functions/params"

const mpAccessToken = defineSecret("MERCADOPAGO_ACCESS_TOKEN")

interface CheckoutItem {
  productId: string
  name: string
  price: string
  image?: string
  quantity: number
}

interface CheckoutRequest {
  items: CheckoutItem[]
  siteUrl?: string
}

interface MpPreferenceResponse {
  init_point?: string
  [key: string]: unknown
}

function parsePrice(priceStr: string): number {
  const cleaned = priceStr.replace(/\s/g, "").replace(/\$/g, "").trim()
  if (!cleaned) return 0
  if (/,/.test(cleaned)) {
    return parseFloat(cleaned.replace(/\./g, "").replace(",", ".")) || 0
  }
  if (/\.\d{3}\b/.test(cleaned)) {
    return parseFloat(cleaned.replace(/\./g, "")) || 0
  }
  return parseFloat(cleaned) || 0
}

export const createMpCheckout = onCall(
  { secrets: [mpAccessToken], invoker: "public", cors: true },
  async (request) => {
    const data = request.data as CheckoutRequest

    if (!data?.items || !Array.isArray(data.items) || data.items.length === 0) {
      throw new HttpsError("invalid-argument", "Se requieren items en el carrito.")
    }

    const token = mpAccessToken.value()
    if (!token) {
      throw new HttpsError(
        "failed-precondition",
        "Mercado Pago no está configurado. Agregá MERCADOPAGO_ACCESS_TOKEN en la configuración."
      )
    }

    const siteUrl = data.siteUrl || "https://casaramayon.com"
    const baseUrl = siteUrl.replace(/\/$/, "")

    const mpItems = data.items.map((item) => {
      const unitPrice = parsePrice(item.price)
      if (unitPrice <= 0) {
        throw new HttpsError(
          "invalid-argument",
          `Precio inválido para "${item.name}": ${item.price}`
        )
      }
      return {
        id: item.productId,
        title: item.name,
        quantity: item.quantity,
        unit_price: unitPrice,
        picture_url: item.image || undefined,
      }
    })

    const body = {
      items: mpItems,
      back_urls: {
        success: `${baseUrl}/?payment=success`,
        failure: `${baseUrl}/?payment=failure`,
        pending: `${baseUrl}/?payment=pending`,
      },
      auto_return: "approved" as const,
    }

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errText = await response.text()
      let errMessage = "Error al crear el checkout con Mercado Pago."
      try {
        const errJson = JSON.parse(errText)
        errMessage = errJson.message || errJson.error || errMessage
      } catch {
        errMessage = errText || errMessage
      }
      throw new HttpsError("internal", errMessage)
    }

    const result = (await response.json()) as MpPreferenceResponse
    const initPoint = result?.init_point

    if (!initPoint) {
      throw new HttpsError("internal", "Mercado Pago no devolvió el link de pago.")
    }

    return { initPoint }
  }
)

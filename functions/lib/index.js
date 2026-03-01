"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMpCheckout = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const mpAccessToken = (0, params_1.defineSecret)("MERCADOPAGO_ACCESS_TOKEN");
function parsePrice(priceStr) {
    const cleaned = priceStr.replace(/\s/g, "").replace(/\$/g, "").trim();
    if (!cleaned)
        return 0;
    if (/,/.test(cleaned)) {
        return parseFloat(cleaned.replace(/\./g, "").replace(",", ".")) || 0;
    }
    if (/\.\d{3}\b/.test(cleaned)) {
        return parseFloat(cleaned.replace(/\./g, "")) || 0;
    }
    return parseFloat(cleaned) || 0;
}
exports.createMpCheckout = (0, https_1.onCall)({ secrets: [mpAccessToken], invoker: "public", cors: true }, async (request) => {
    const data = request.data;
    if (!(data === null || data === void 0 ? void 0 : data.items) || !Array.isArray(data.items) || data.items.length === 0) {
        throw new https_1.HttpsError("invalid-argument", "Se requieren items en el carrito.");
    }
    const token = mpAccessToken.value();
    if (!token) {
        throw new https_1.HttpsError("failed-precondition", "Mercado Pago no está configurado. Agregá MERCADOPAGO_ACCESS_TOKEN en la configuración.");
    }
    const siteUrl = data.siteUrl || "https://casaramayon.com";
    const baseUrl = siteUrl.replace(/\/$/, "");
    const mpItems = data.items.map((item) => {
        const unitPrice = parsePrice(item.price);
        if (unitPrice <= 0) {
            throw new https_1.HttpsError("invalid-argument", `Precio inválido para "${item.name}": ${item.price}`);
        }
        return {
            id: item.productId,
            title: item.name,
            quantity: item.quantity,
            unit_price: unitPrice,
            picture_url: item.image || undefined,
        };
    });
    const body = {
        items: mpItems,
        back_urls: {
            success: `${baseUrl}/?payment=success`,
            failure: `${baseUrl}/?payment=failure`,
            pending: `${baseUrl}/?payment=pending`,
        },
        auto_return: "approved",
    };
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const errText = await response.text();
        let errMessage = "Error al crear el checkout con Mercado Pago.";
        try {
            const errJson = JSON.parse(errText);
            errMessage = errJson.message || errJson.error || errMessage;
        }
        catch (_a) {
            errMessage = errText || errMessage;
        }
        throw new https_1.HttpsError("internal", errMessage);
    }
    const result = (await response.json());
    const initPoint = result === null || result === void 0 ? void 0 : result.init_point;
    if (!initPoint) {
        throw new https_1.HttpsError("internal", "Mercado Pago no devolvió el link de pago.");
    }
    return { initPoint };
});
//# sourceMappingURL=index.js.map
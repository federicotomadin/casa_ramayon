"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.mpEventWebhook = exports.createEventCheckout = exports.createMpCheckout = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const admin = __importStar(require("firebase-admin"));
const QRCode = __importStar(require("qrcode"));
const nodemailer = __importStar(require("nodemailer"));
admin.initializeApp();
const firestore = admin.firestore();
const mpAccessToken = (0, params_1.defineSecret)("MERCADOPAGO_ACCESS_TOKEN");
const smtpEmail = (0, params_1.defineSecret)("SMTP_EMAIL");
const smtpPassword = (0, params_1.defineSecret)("SMTP_PASSWORD");
const webhookUrl = (0, params_1.defineSecret)("WEBHOOK_URL");
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
exports.createEventCheckout = (0, https_1.onCall)({ secrets: [mpAccessToken, webhookUrl], invoker: "public", cors: true }, async (request) => {
    const data = request.data;
    if (!(data === null || data === void 0 ? void 0 : data.email) || !(data === null || data === void 0 ? void 0 : data.eventoId) || !(data === null || data === void 0 ? void 0 : data.eventTitle) || !(data === null || data === void 0 ? void 0 : data.eventPrice)) {
        throw new https_1.HttpsError("invalid-argument", "Faltan datos obligatorios.");
    }
    const token = mpAccessToken.value();
    if (!token) {
        throw new https_1.HttpsError("failed-precondition", "Mercado Pago no está configurado.");
    }
    const unitPrice = parsePrice(data.eventPrice);
    if (unitPrice <= 0) {
        throw new https_1.HttpsError("invalid-argument", `Precio inválido: ${data.eventPrice}`);
    }
    await firestore.collection("usuarios").add({
        email: data.email.trim().toLowerCase(),
        nombre: data.nombre || "",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    const siteUrl = (data.siteUrl || "https://casaramayon.com").replace(/\/$/, "");
    const externalRef = JSON.stringify({
        type: "event_ticket",
        email: data.email.trim().toLowerCase(),
        nombre: data.nombre || "",
        eventoId: data.eventoId,
        eventTitle: data.eventTitle,
        siteUrl,
    });
    const body = {
        items: [
            {
                id: data.eventoId,
                title: `Entrada: ${data.eventTitle}`,
                quantity: 1,
                unit_price: unitPrice,
                picture_url: data.eventImage || undefined,
            },
        ],
        payer: { email: data.email.trim().toLowerCase() },
        external_reference: externalRef,
        back_urls: {
            success: `${siteUrl}/?payment=success&type=event`,
            failure: `${siteUrl}/?payment=failure&type=event`,
            pending: `${siteUrl}/?payment=pending&type=event`,
        },
        auto_return: "approved",
        ...(isValidUrl(webhookUrl.value()) ? { notification_url: webhookUrl.value() } : {}),
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
        let errMessage = "Error al crear el checkout.";
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
    if (!(result === null || result === void 0 ? void 0 : result.init_point)) {
        throw new https_1.HttpsError("internal", "Mercado Pago no devolvió el link de pago.");
    }
    return { initPoint: result.init_point };
});
async function sendTicketEmail(toEmail, nombre, eventTitle, qrDataUrl, senderEmail, senderPassword) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: senderEmail, pass: senderPassword },
    });
    const qrBase64 = qrDataUrl.replace(/^data:image\/png;base64,/, "");
    await transporter.sendMail({
        from: `"Casa Ramayon" <${senderEmail}>`,
        to: toEmail,
        subject: `Tu entrada para ${eventTitle} - Casa Ramayon`,
        html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h1 style="color:#1a1a1a;font-size:24px">¡Hola${nombre ? ` ${nombre}` : ""}!</h1>
        <p style="color:#444;font-size:16px;line-height:1.6">
          Tu entrada para <strong>${eventTitle}</strong> fue confirmada.
        </p>
        <p style="color:#444;font-size:16px;line-height:1.6">
          Presentá este código QR en la entrada del evento:
        </p>
        <div style="text-align:center;padding:24px 0">
          <img src="cid:qrcode" alt="Código QR" style="width:250px;height:250px" />
        </div>
        <p style="color:#888;font-size:13px;text-align:center">
          Este QR es de un solo uso. No lo compartas con nadie.
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
        <p style="color:#aaa;font-size:12px;text-align:center">Casa Ramayon</p>
      </div>
    `,
        attachments: [
            {
                filename: "entrada-qr.png",
                content: Buffer.from(qrBase64, "base64"),
                cid: "qrcode",
            },
        ],
    });
}
exports.mpEventWebhook = (0, https_1.onRequest)({ secrets: [mpAccessToken, smtpEmail, smtpPassword], cors: true, invoker: "public" }, async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).send("Method not allowed");
        return;
    }
    const { type, data } = req.body || {};
    if (type !== "payment" || !(data === null || data === void 0 ? void 0 : data.id)) {
        res.status(200).send("OK - ignored");
        return;
    }
    const token = mpAccessToken.value();
    if (!token) {
        res.status(500).send("MP token not configured");
        return;
    }
    try {
        const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!paymentRes.ok) {
            console.error("Failed to fetch payment:", await paymentRes.text());
            res.status(200).send("OK");
            return;
        }
        const payment = (await paymentRes.json());
        if (payment.status !== "approved") {
            res.status(200).send("OK - not approved");
            return;
        }
        if (!payment.external_reference) {
            res.status(200).send("OK - no reference");
            return;
        }
        let refData;
        try {
            refData = JSON.parse(payment.external_reference);
        }
        catch (_a) {
            res.status(200).send("OK - invalid reference");
            return;
        }
        if (refData.type !== "event_ticket" || !refData.email || !refData.eventoId) {
            res.status(200).send("OK - not an event ticket");
            return;
        }
        const existing = await firestore
            .collection("entradas")
            .where("mpPaymentId", "==", data.id)
            .limit(1)
            .get();
        if (!existing.empty) {
            res.status(200).send("OK - already processed");
            return;
        }
        const qrToken = generateToken();
        const siteUrl = (refData.siteUrl || "https://casaramayon.com").replace(/\/$/, "");
        const qrUrl = `${siteUrl}/panel/validar-entrada?token=${qrToken}`;
        await firestore.collection("entradas").add({
            email: refData.email,
            nombre: refData.nombre || "",
            eventoId: refData.eventoId,
            eventoTitle: refData.eventTitle || "",
            estado: "pending",
            qrToken,
            mpPaymentId: data.id,
            fechaCompra: admin.firestore.FieldValue.serverTimestamp(),
            fechaIngreso: null,
        });
        const emailUser = smtpEmail.value();
        const emailPass = smtpPassword.value();
        if (emailUser && emailPass) {
            const qrDataUrl = await QRCode.toDataURL(qrUrl, { width: 300, margin: 2 });
            await sendTicketEmail(refData.email, refData.nombre || "", refData.eventTitle || "Evento", qrDataUrl, emailUser, emailPass);
        }
        else {
            console.warn("SMTP not configured - skipping email");
        }
        res.status(200).send("OK - ticket created");
    }
    catch (err) {
        console.error("Webhook error:", err);
        res.status(200).send("OK - error handled");
    }
});
function isValidUrl(value) {
    if (!value)
        return false;
    try {
        const url = new URL(value);
        return url.protocol === "https:" && url.hostname !== "placeholder";
    }
    catch (_a) {
        return false;
    }
}
function generateToken() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const segments = [];
    for (let s = 0; s < 4; s++) {
        let segment = "";
        for (let i = 0; i < 8; i++) {
            segment += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        segments.push(segment);
    }
    return segments.join("-");
}
//# sourceMappingURL=index.js.map
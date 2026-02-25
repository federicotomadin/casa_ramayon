const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ""
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "casa_ramayon"

export const isCloudinaryConfigured = (): boolean => Boolean(CLOUD_NAME)

export const uploadToCloudinary = async (
  file: File,
  folder: string = "general"
): Promise<string> => {
  if (!CLOUD_NAME) throw new Error("Cloudinary no configurado")
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", UPLOAD_PRESET)
  formData.append("folder", `casa_ramayon/${folder}`)
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  )
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || "Error al subir imagen")
  }
  const data = await res.json()
  return data.secure_url
}

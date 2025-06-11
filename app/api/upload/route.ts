import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 })
    }

    // Générer un nom de fichier unique basé sur le timestamp et le nom original
    const timestamp = Date.now()
    const fileName = file.name.replace(/\s+/g, "-").toLowerCase()
    const uniqueFileName = `${timestamp}-${fileName}`

    // Déterminer le dossier en fonction du type de fichier
    const fileType = file.type.split("/")[0] // 'image', 'application', etc.
    const folder = fileType === "image" ? "images" : "documents"

    // Uploader le fichier vers Vercel Blob
    const blob = await put(`${folder}/${uniqueFileName}`, file, {
      access: "public",
      contentType: file.type, // Assurez-vous que le type de contenu est correctement défini
    })

    return NextResponse.json({ url: blob.url, success: true })
  } catch (error) {
    console.error("Erreur lors de l'upload du fichier:", error)
    return NextResponse.json({ error: "Erreur lors de l'upload du fichier", details: String(error) }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false, // Désactiver le parseur de corps par défaut pour les fichiers volumineux
  },
}

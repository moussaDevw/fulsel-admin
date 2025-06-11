"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface UploadResult {
  url: string
  success: boolean
}

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const uploadFile = async (file: File): Promise<UploadResult> => {
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Erreur de réponse:", errorText)
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()

      return {
        url: data.url,
        success: true,
      }
    } catch (error) {
      console.error("Erreur d'upload:", error)
      toast({
        title: "Erreur",
        description: `Impossible d'uploader le fichier: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })

      return {
        url: "",
        success: false,
      }
    } finally {
      setIsUploading(false)
    }
  }

  return {
    uploadFile,
    isUploading,
  }
}

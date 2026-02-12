"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useUploadThing } from "@/lib/uploadthing-client"

interface UploadResult {
  url: string
  key: string
  success: boolean
}

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  // Use the imageUploader by default, but this can be adjusted if needed
  const { startUpload } = useUploadThing("imageUploader", {
    onUploadError: (error) => {
      console.error("UploadThing Error (Image):", error);
    },
  })
  const { startUpload: startPdfUpload } = useUploadThing("pdfUploader", {
    onUploadError: (error) => {
      console.error("UploadThing Error (PDF):", error);
    },
  })

  const uploadFile = async (file: File): Promise<UploadResult> => {
    setIsUploading(true)

    try {
      // Determine which uploader to use
      const isPdf = file.type === "application/pdf"
      const uploadFn = isPdf ? startPdfUpload : startUpload

      console.log("Starting upload for file:", file.name, "type:", file.type);
      const res = await uploadFn([file]).catch(err => {
        console.error("Internal startUpload error:", err);
        throw err;
      });

      console.log("Upload response:", res);

      if (!res || res.length === 0) {
        throw new Error("Le téléchargement a échoué ou a été annulé (réponse vide).")
      }

      return {
        url: res[0].url,
        key: res[0].key,
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
        key: "",
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

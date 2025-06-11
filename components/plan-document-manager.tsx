"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Trash2, Plus, FileImage } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { v4 as uuidv4 } from "@/lib/uuid"
import { useFileUpload } from "@/hooks/use-file-upload"

interface Plan {
  id: string
  title: string
  fileUrl: string
  thumbnailUrl?: string
}

interface PlanDocumentManagerProps {
  plans: Plan[]
  onChange: (plans: Plan[]) => void
}

export function PlanDocumentManager({ plans = [], onChange }: PlanDocumentManagerProps) {
  const { toast } = useToast()
  const { uploadFile, isUploading } = useFileUpload()
  const [newPlanTitle, setNewPlanTitle] = useState("")
  const [isUploadingPdf, setIsUploadingPdf] = useState(false)
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)

  const handleAddPlan = async () => {
    const fileInput = document.getElementById("plan-file") as HTMLInputElement
    const thumbnailInput = document.getElementById("plan-thumbnail") as HTMLInputElement

    const files = fileInput?.files
    const thumbnailFiles = thumbnailInput?.files

    if (!files || files.length === 0) {
      toast({
        title: "Aucun fichier sélectionné",
        description: "Veuillez sélectionner un fichier PDF.",
        variant: "destructive",
      })
      return
    }

    if (!newPlanTitle.trim()) {
      toast({
        title: "Titre requis",
        description: "Veuillez entrer un titre pour le plan.",
        variant: "destructive",
      })
      return
    }

    setIsUploadingPdf(true)

    try {
      // Upload du fichier PDF
      const pdfFile = files[0]
      const pdfResult = await uploadFile(pdfFile)

      if (!pdfResult.success) {
        toast({
          title: "Erreur",
          description: "Impossible de télécharger le fichier PDF.",
          variant: "destructive",
        })
        return
      }

      // Upload de la miniature si présente
      let thumbnailUrl = undefined

      if (thumbnailFiles && thumbnailFiles.length > 0) {
        setIsUploadingThumbnail(true)
        try {
          const thumbnailFile = thumbnailFiles[0]
          const thumbnailResult = await uploadFile(thumbnailFile)

          if (thumbnailResult.success) {
            thumbnailUrl = thumbnailResult.url
          } else {
            toast({
              title: "Avertissement",
              description: "Impossible de télécharger la miniature, mais le plan a été ajouté.",
              variant: "warning",
            })
          }
        } finally {
          setIsUploadingThumbnail(false)
        }
      }

      const newPlan: Plan = {
        id: uuidv4(),
        title: newPlanTitle.trim(),
        fileUrl: pdfResult.url,
        thumbnailUrl,
      }

      onChange([...plans, newPlan])
      setNewPlanTitle("")

      // Reset file inputs
      if (fileInput) fileInput.value = ""
      if (thumbnailInput) thumbnailInput.value = ""

      toast({
        title: "Plan ajouté",
        description: `Le plan "${newPlanTitle}" a été ajouté avec succès.`,
      })
    } catch (error) {
      console.error("Erreur lors de l'ajout du plan:", error)
      toast({
        title: "Erreur",
        description: `Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setIsUploadingPdf(false)
    }
  }

  const handleRemovePlan = (id: string) => {
    onChange(plans.filter((plan) => plan.id !== id))

    toast({
      title: "Plan supprimé",
      description: "Le plan a été supprimé avec succès.",
    })
  }

  const handleUpdateThumbnail = async (id: string, thumbnailFiles: FileList | null) => {
    if (!thumbnailFiles || thumbnailFiles.length === 0) return

    setIsUploadingThumbnail(true)

    try {
      const thumbnailFile = thumbnailFiles[0]
      const result = await uploadFile(thumbnailFile)

      if (result.success) {
        onChange(plans.map((plan) => (plan.id === id ? { ...plan, thumbnailUrl: result.url } : plan)))

        toast({
          title: "Miniature mise à jour",
          description: "La miniature a été mise à jour avec succès.",
        })
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour la miniature.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la miniature:", error)
      toast({
        title: "Erreur",
        description: `Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setIsUploadingThumbnail(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Ajouter un nouveau plan</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm font-medium mb-1.5">Titre du plan</div>
              <Input
                id="plan-title"
                value={newPlanTitle}
                onChange={(e) => setNewPlanTitle(e.target.value)}
                placeholder="Ex: Plan d'étage, Plan de masse..."
              />
            </div>

            <div>
              <div className="text-sm font-medium mb-1.5">Fichier PDF</div>
              <Input id="plan-file" type="file" accept=".pdf" />
            </div>

            <div>
              <div className="text-sm font-medium mb-1.5">Miniature (optionnel)</div>
              <Input id="plan-thumbnail" type="file" accept="image/*" />
              <p className="text-sm text-muted-foreground mt-1">Image qui sera affichée comme aperçu du PDF</p>
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                onClick={handleAddPlan}
                className="w-full sm:w-auto"
                disabled={isUploadingPdf || isUploadingThumbnail}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isUploadingPdf ? "Téléchargement..." : "Ajouter le plan"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {plans.length === 0 ? (
        <div className="text-sm text-muted-foreground py-2">Aucun plan ajouté</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-[3/4] relative bg-muted">
                  {plan.thumbnailUrl ? (
                    <Image
                      src={plan.thumbnailUrl || "/placeholder.svg"}
                      alt={plan.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <FileText className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex gap-2">
                      <a
                        href={plan.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Voir
                      </a>
                      <Button variant="destructive" size="sm" onClick={() => handleRemovePlan(plan.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-medium truncate">{plan.title}</h4>

                  <div className="mt-2 flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        id={`thumbnail-update-${plan.id}`}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleUpdateThumbnail(plan.id, e.target.files)}
                        disabled={isUploadingThumbnail}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled={isUploadingThumbnail}
                      >
                        <FileImage className="h-4 w-4 mr-2" />
                        {isUploadingThumbnail ? "Téléchargement..." : "Changer miniature"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

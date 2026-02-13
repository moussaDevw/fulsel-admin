"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Upload, X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useFileUpload } from "@/hooks/use-file-upload"

interface ImageGalleryProps {
  gallery: Record<string, string[]>
  onChange: (gallery: Record<string, string[]>) => void
}

export function ImageGallery({ gallery = {}, onChange }: ImageGalleryProps) {
  const { toast } = useToast()
  const { uploadFile, isUploading } = useFileUpload()
  const [newCategory, setNewCategory] = useState("")
  const [newImageUrl, setNewImageUrl] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const categories = Object.keys(gallery)

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      if (gallery[newCategory]) {
        toast({
          title: "Catégorie existante",
          description: "Cette catégorie existe déjà.",
          variant: "destructive",
        })
        return
      }

      const updatedGallery = {
        ...gallery,
        [newCategory]: [],
      }
      onChange(updatedGallery)
      setSelectedCategory(newCategory)
      setNewCategory("")
    }
  }

  const handleRemoveCategory = (category: string) => {
    const { [category]: _, ...rest } = gallery
    onChange(rest)
    if (selectedCategory === category) {
      setSelectedCategory(null)
    }
  }

  const handleAddImage = (category: string) => {
    if (newImageUrl.trim()) {
      const updatedGallery = {
        ...gallery,
        [category]: [...(gallery[category] || []), newImageUrl],
      }
      onChange(updatedGallery)
      setNewImageUrl("")
    }
  }

  const handleRemoveImage = (category: string, index: number) => {
    const updatedImages = [...gallery[category]]
    updatedImages.splice(index, 1)

    const updatedGallery = {
      ...gallery,
      [category]: updatedImages,
    }
    onChange(updatedGallery)
  }

  const handleImageUpload = async (category: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setIsUploadingImage(true)

    let successCount = 0
    let failCount = 0
    const newUrls: string[] = []

    try {
      // Pour une meilleure UX, on peut uploader en parallèle avec Promise.all ou séquentiellement
      // Utilisons une boucle pour pouvoir mettre à jour l'UI au fur et à mesure si on veut, 
      // ou simplement tout traiter.
      for (const file of files) {
        try {
          const result = await uploadFile(file)
          if (result.success) {
            newUrls.push(result.url)
            successCount++
          } else {
            failCount++
          }
        } catch (err) {
          console.error(`Erreur lors de l'upload de ${file.name}:`, err)
          failCount++
        }
      }

      if (newUrls.length > 0) {
        const updatedGallery = {
          ...gallery,
          [category]: [...(gallery[category] || []), ...newUrls],
        }
        onChange(updatedGallery)
      }

      if (successCount > 0) {
        toast({
          title: "Téléchargement terminé",
          description: `${successCount} image(s) ajoutée(s) avec succès.${failCount > 0 ? ` (${failCount} échec(s))` : ""}`,
        })
      } else if (failCount > 0) {
        toast({
          title: "Échec du téléchargement",
          description: "Aucune image n'a pu être téléchargée.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur globale lors du téléchargement:", error)
      toast({
        title: "Erreur",
        description: "Une erreur critique est survenue lors de l'envoi.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingImage(false)
      e.target.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nom de la catégorie (ex: STUDIOS, PENTHOUSE...)"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddCategory()
              }
            }}
          />
          <Button type="button" onClick={handleAddCategory} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une catégorie
          </Button>
        </div>

        {categories.length === 0 ? (
          <div className="text-sm text-muted-foreground py-2">Aucune catégorie ajoutée</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <Button
                  type="button"
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-r-none"
                >
                  {category} ({gallery[category]?.length || 0})
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveCategory(category)}
                  className="h-10 rounded-l-none border-l-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCategory && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Images pour {selectedCategory}</h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <Input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Coller l'URL d'une image..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddImage(selectedCategory)
                      }
                    }}
                    className="flex-1"
                  />
                  <Button type="button" onClick={() => handleAddImage(selectedCategory)} variant="secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>

                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={(e) => handleImageUpload(selectedCategory, e)}
                    disabled={isUploadingImage}
                  />
                  <div className={`
                    border-2 border-dashed rounded-xl p-8 transition-all duration-200 flex flex-col items-center justify-center gap-2
                    ${isUploadingImage ? 'bg-muted/50 border-muted' : 'border-muted-foreground/20 group-hover:border-primary/50 group-hover:bg-primary/5'}
                  `}>
                    <div className="p-3 bg-background rounded-full shadow-sm border mb-1">
                      {isUploadingImage ? (
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                      ) : (
                        <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">
                        {isUploadingImage ? "Envoi en cours..." : "Cliquez ou glissez une image ici"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 text-center">
                        PNG, JPG ou WEBP jusqu'à 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {!gallery[selectedCategory] || (gallery[selectedCategory].length === 0 && !isUploadingImage) ? (
                <div className="text-sm text-center text-muted-foreground py-10 bg-muted/20 rounded-lg border border-dashed">
                  Aucune image dans cette catégorie
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {/* Images existantes */}
                  {gallery[selectedCategory]?.map((imageUrl, index) => (
                    <div key={index} className="relative group aspect-square overflow-hidden rounded-xl border bg-muted shadow-sm hover:shadow-md transition-all duration-200">
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8 scale-75 group-hover:scale-100 transition-transform duration-200"
                          onClick={() => handleRemoveImage(selectedCategory, index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Placeholder de chargement (In-Grid Loading) */}
                  {isUploadingImage && (
                    <div className="relative aspect-square rounded-xl border-2 border-primary/30 bg-primary/5 overflow-hidden animate-pulse flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 text-primary animate-spin" />
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Upload...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

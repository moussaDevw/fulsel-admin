"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Upload, X } from "lucide-react"
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
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploadingImage(true)

    try {
      const file = files[0]
      const result = await uploadFile(file)

      if (result.success) {
        const updatedGallery = {
          ...gallery,
          [category]: [...(gallery[category] || []), result.url],
        }
        onChange(updatedGallery)

        toast({
          title: "Image téléchargée",
          description: "L'image a été téléchargée avec succès.",
        })
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de télécharger l'image.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image:", error)
      toast({
        title: "Erreur",
        description: `Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setIsUploadingImage(false)
      // Reset the input
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
              <div className="flex gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="URL de l'image"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddImage(selectedCategory)
                    }
                  }}
                />
                <Button type="button" onClick={() => handleAddImage(selectedCategory)} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter URL
                </Button>
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleImageUpload(selectedCategory, e)}
                    disabled={isUploadingImage}
                  />
                  <Button type="button" variant="outline" disabled={isUploadingImage}>
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploadingImage ? "Téléchargement..." : "Upload"}
                  </Button>
                </div>
              </div>

              {!gallery[selectedCategory] || gallery[selectedCategory].length === 0 ? (
                <div className="text-sm text-muted-foreground py-2">Aucune image dans cette catégorie</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {gallery[selectedCategory].map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square relative overflow-hidden rounded-md border">
                        <Image
                          src={imageUrl || "/placeholder.svg"}
                          alt={`Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(selectedCategory, index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

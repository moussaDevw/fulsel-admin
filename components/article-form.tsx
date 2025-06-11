"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useFileUpload } from "@/hooks/use-file-upload"

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  image: z.string().min(1, "L'image est requise"),
  excerpt: z.string().min(1, "Le résumé est requis").max(200, "Le résumé ne doit pas dépasser 200 caractères"),
  content: z.string().min(1, "Le contenu est requis"),
  publishedAt: z.date({ required_error: "La date de publication est requise" }),
  author: z.string().min(1, "L'auteur est requis"),
})

type FormValues = z.infer<typeof formSchema>

export function ArticleForm({ id }: { id?: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const { uploadFile, isUploading } = useFileUpload()
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      image: "",
      excerpt: "",
      content: "",
      publishedAt: new Date(),
      author: "",
    },
  })

  // Load article data if editing
  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        try {
          setIsLoading(true)
          const response = await fetch(`/api/articles/${id}`)

          if (!response.ok) {
            throw new Error("Erreur lors de la récupération de l'article")
          }

          const data = await response.json()

          form.reset({
            title: data.title,
            slug: data.slug,
            image: data.image,
            excerpt: data.excerpt,
            content: data.content,
            publishedAt: new Date(data.published_at),
            author: data.author,
          })

          setImagePreview(data.image)
        } catch (error) {
          console.error("Erreur:", error)
          toast({
            title: "Erreur",
            description: "Impossible de charger les données de l'article",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }

      fetchArticle()
    }
  }, [id, form, toast])

  // Modifier la fonction generateSlug pour inclure la date de publication
  const generateSlug = (title: string, date: Date) => {
    // Format de la date: YYYY-MM-DD
    const formattedDate = format(date, "yyyy-MM-dd", { locale: fr })

    // Générer le slug à partir du titre
    const titleSlug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
      .replace(/[^\w\s-]/g, "") // Supprimer les caractères spéciaux
      .trim() // Supprimer les espaces au début et à la fin
      .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
      .replace(/-+/g, "-") // Remplacer les tirets multiples par un seul tiret

    // Combiner la date et le titre
    return `${formattedDate}-${titleSlug}`
  }

  // Modifier la fonction handleTitleChange pour utiliser la nouvelle fonction generateSlug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    form.setValue("title", title)

    // Récupérer la date de publication actuelle
    const publishedAt = form.getValues("publishedAt")

    // Only auto-generate slug if it's empty or matches the previous auto-generated slug
    const currentSlug = form.getValues("slug")
    const previousTitle = form.getValues("title")
    const previousAutoSlug = generateSlug(previousTitle, publishedAt)

    if (!currentSlug || currentSlug === previousAutoSlug) {
      form.setValue("slug", generateSlug(title, publishedAt))
    }
  }

  // Ajouter un gestionnaire pour mettre à jour le slug lorsque la date change
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      form.setValue("publishedAt", date)

      // Mettre à jour le slug avec la nouvelle date
      const title = form.getValues("title")
      const currentSlug = form.getValues("slug")
      const previousTitle = form.getValues("title")
      const previousDate = form.getValues("publishedAt")
      const previousAutoSlug = generateSlug(previousTitle, previousDate)

      if (!currentSlug || currentSlug === previousAutoSlug) {
        form.setValue("slug", generateSlug(title, date))
      }
    }
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      const file = files[0]
      const result = await uploadFile(file)

      if (result.success) {
        form.setValue("image", result.url)
        setImagePreview(result.url)

        toast({
          title: "Image téléchargée",
          description: `L'image ${file.name} a été téléchargée avec succès.`,
        })
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive",
      })
    }
  }

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)

    try {
      // Préparer les données pour l'API
      const formattedData = {
        ...data,
        publishedAt: format(data.publishedAt, "yyyy-MM-dd"),
      }

      // Déterminer si c'est une création ou une mise à jour
      const url = id ? `/api/articles/${id}` : "/api/articles"
      const method = id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      toast({
        title: "Succès",
        description: id ? "Article mis à jour avec succès" : "Article créé avec succès",
      })

      router.push("/admin/articles")
      router.refresh()
    } catch (error) {
      console.error("Erreur lors de la soumission:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de l'article",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre</FormLabel>
                      <FormControl>
                        <Input {...field} onChange={handleTitleChange} placeholder="Titre de l'article" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="slug-de-l-article" />
                      </FormControl>
                      <FormDescription>Utilisé pour l'URL de l'article</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Auteur</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nom de l'auteur" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publishedAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date de publication</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date)
                              handleDateChange(date)
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Résumé</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Bref résumé de l'article (max 200 caractères)" />
                    </FormControl>
                    <FormDescription>Ce résumé sera affiché dans la liste des articles et les aperçus</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image principale</FormLabel>
                    <div className="space-y-4">
                      {imagePreview && (
                        <div className="relative aspect-video w-full max-w-xl overflow-hidden rounded-md border">
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Aperçu de l'image"
                            fill
                            className="object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              form.setValue("image", "")
                              setImagePreview(null)
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      {!imagePreview && (
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            id="article-image"
                            onChange={handleImageUpload}
                            className="max-w-md"
                            disabled={isUploading}
                          />
                          <div className="text-sm text-muted-foreground">
                            {isUploading
                              ? "Téléchargement en cours..."
                              : "Formats recommandés: JPG, PNG. Taille idéale: 1200x630px"}
                          </div>
                        </div>
                      )}

                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenu de l'article</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Contenu de l'article..." className="min-h-[300px] font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/articles")}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading || isUploading}>
            {isLoading || isUploading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

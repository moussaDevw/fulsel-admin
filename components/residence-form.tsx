"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Trash2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { DynamicList } from "@/components/dynamic-list"
import { ImageGallery } from "@/components/image-gallery"
import { PlanDocumentManager } from "@/components/plan-document-manager"
import { useFileUpload } from "@/hooks/use-file-upload"

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  status: z.enum(["En cours", "À venir"]),
  startDate: z.date({ required_error: "La date de début est requise" }),
  endDate: z.date({ required_error: "La date de fin est requise" }),
  location: z.string().optional(),
  description: z.array(z.string()).min(1, "Au moins un paragraphe de description est requis"),
  apartmentTypes: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  brochureUrl: z.string().url().optional().or(z.literal("")),
  plans: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        fileUrl: z.string(),
        thumbnailUrl: z.string().optional(),
      }),
    )
    .optional(),
  gallery: z.record(z.string(), z.array(z.string())).optional(),
})

type FormValues = z.infer<typeof formSchema>

export function ResidenceForm({ id }: { id?: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const { uploadFile, isUploading: isUploadingFile } = useFileUpload()

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      status: "À venir",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 12)),
      location: "",
      description: [""],
      apartmentTypes: [],
      amenities: [],
      brochureUrl: "",
      plans: [],
      gallery: {},
    },
  })

  // Load residence data if editing
  useEffect(() => {
    if (id) {
      const fetchResidence = async () => {
        try {
          setIsLoading(true)
          const response = await fetch(`/api/residences/${id}`)

          if (!response.ok) {
            throw new Error("Erreur lors de la récupération de la résidence")
          }

          const data = await response.json()

          // Convertir les dates de string à Date
          const formattedData = {
            ...data,
            startDate: new Date(data.start_date),
            endDate: new Date(data.end_date),
          }

          form.reset({
            title: formattedData.title,
            slug: formattedData.slug,
            status: formattedData.status,
            startDate: formattedData.startDate,
            endDate: formattedData.endDate,
            location: formattedData.location || "",
            description: formattedData.description || [""],
            apartmentTypes: formattedData.apartmentTypes || [],
            amenities: formattedData.amenities || [],
            brochureUrl: formattedData.brochure_url || "",
            plans: formattedData.plans || [],
            gallery: formattedData.gallery || {},
          })
        } catch (error) {
          console.error("Erreur:", error)
          toast({
            title: "Erreur",
            description: "Impossible de charger les données de la résidence",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }

      fetchResidence()
    }
  }, [id, form, toast])

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
      .replace(/[^\w\s-]/g, "") // Supprimer les caractères spéciaux
      .trim() // Supprimer les espaces au début et à la fin
      .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
      .replace(/-+/g, "-") // Remplacer les tirets multiples par un seul tiret
  }

  // Handle title change to auto-generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    form.setValue("title", title)

    // Only auto-generate slug if it's empty or matches the previous auto-generated slug
    const currentSlug = form.getValues("slug")
    const previousTitle = form.getValues("title")
    const previousAutoSlug = generateSlug(previousTitle)

    if (!currentSlug || currentSlug === previousAutoSlug) {
      form.setValue("slug", generateSlug(title))
    }
  }

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)

    try {
      // Préparer les données pour l'API
      const formattedData = {
        ...data,
        startDate: format(data.startDate, "yyyy-MM-dd"),
        endDate: format(data.endDate, "yyyy-MM-dd"),
      }

      // Déterminer si c'est une création ou une mise à jour
      const url = id ? `/api/residences/${id}` : "/api/residences"
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
        description: id ? "Résidence mise à jour avec succès" : "Résidence créée avec succès",
      })

      router.push("/admin/residences")
      router.refresh()
    } catch (error) {
      console.error("Erreur lors de la soumission:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la résidence",
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
            <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input {...field} onChange={handleTitleChange} placeholder="Nom de la résidence" />
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
                      <Input {...field} placeholder="slug-de-la-residence" />
                    </FormControl>
                    <FormDescription>Utilisé pour l'URL de la page publique</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="À venir">À venir</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localisation (Google Maps)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://maps.google.com/?q=..." />
                    </FormControl>
                    <FormDescription>Lien Google Maps vers l'emplacement</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de début</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
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
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de fin</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
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
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="sm:col-span-2">
                <h3 className="text-lg font-medium mb-2">Brochure</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="brochureUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de la brochure</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/brochure.pdf" />
                        </FormControl>
                        <FormDescription>Lien vers le PDF de la brochure</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <div className="text-sm font-medium mb-1.5">Ou télécharger directement</div>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept=".pdf"
                          id="brochure-upload"
                          onChange={async (e) => {
                            const files = e.target.files
                            if (files && files.length > 0) {
                              try {
                                const file = files[0]
                                const result = await uploadFile(file)

                                if (result.success) {
                                  form.setValue("brochureUrl", result.url)

                                  toast({
                                    title: "Brochure téléchargée",
                                    description: `Le fichier ${file.name} a été téléchargé avec succès.`,
                                  })
                                }
                              } catch (error) {
                                console.error("Erreur:", error)
                                toast({
                                  title: "Erreur",
                                  description: "Impossible de télécharger la brochure",
                                  variant: "destructive",
                                })
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Format PDF uniquement</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paragraphes de description</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {field.value.map((paragraph, index) => (
                        <div key={index} className="flex gap-2">
                          <Textarea
                            value={paragraph}
                            onChange={(e) => {
                              const newValue = [...field.value]
                              newValue[index] = e.target.value
                              field.onChange(newValue)
                            }}
                            placeholder="Paragraphe de description..."
                            className="min-h-[100px]"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newValue = [...field.value]
                              newValue.splice(index, 1)
                              field.onChange(newValue.length ? newValue : [""])
                            }}
                            disabled={field.value.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          field.onChange([...field.value, ""])
                        }}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un paragraphe
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Typologies d'appartements</h2>

            <FormField
              control={form.control}
              name="apartmentTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Types d'appartements</FormLabel>
                  <FormControl>
                    <DynamicList
                      items={field.value || []}
                      onChange={field.onChange}
                      placeholder="Ex: 11 studios F1, 8 appartements F2..."
                      emptyMessage="Aucun type d'appartement ajouté"
                      addButtonText="Ajouter un type d'appartement"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Commodités</h2>

            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commodités</FormLabel>
                  <FormControl>
                    <DynamicList
                      items={field.value || []}
                      onChange={field.onChange}
                      placeholder="Ex: Piscine sur la terrasse, salle de sport..."
                      emptyMessage="Aucune commodité ajoutée"
                      addButtonText="Ajouter une commodité"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Plans PDF</h2>

            <FormField
              control={form.control}
              name="plans"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plans du projet</FormLabel>
                  <FormControl>
                    <PlanDocumentManager plans={field.value || []} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Galerie d'images</h2>

            <FormField
              control={form.control}
              name="gallery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images par catégorie</FormLabel>
                  <FormControl>
                    <ImageGallery gallery={field.value || {}} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/residences")}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

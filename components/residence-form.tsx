"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Trash2, Plus, ImagePlus, Loader2, ArrowRight, ArrowLeft, Save, X, Upload } from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { serializeBigInt } from "@/lib/bigint-utils"

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  slug: z.string().optional(),
  image_cover: z.string().optional(),
  image_cover_public_id: z.string().optional(),
  image_banner: z.string().optional(),
  image_banner_public_id: z.string().optional(),
  status: z.enum(["En cours", "À venir"]),
  startDate: z.date({ required_error: "La date de début est requise" }),
  endDate: z.date({ required_error: "La date de fin est requise" }),
  location: z.string().optional(),
  description: z.array(z.string()).min(1, "Au moins un paragraphe de description est requis"),
  apartmentTypes: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  brochureUrl: z.string().optional().or(z.literal("")),
  brochure_public_id: z.string().optional(),
  plans: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        fileUrl: z.string(),
        thumbnailUrl: z.string().optional(),
        // Note: we might want fileKey here too if we want to delete plans
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
  const [currentStep, setCurrentStep] = useState("general")
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [bannerImage, setBannerImage] = useState<string | null>(null)
  const [sessionFiles, setSessionFiles] = useState<string[]>([])

  const deleteFile = async (key: string) => {
    try {
      await fetch("/api/uploadthing/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileKeys: [key] }),
      })
    } catch (error) {
      console.error("Failed to delete file:", error)
    }
  }

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
            startDate: data.startDate ? new Date(data.startDate) : new Date(),
            endDate: data.endDate ? new Date(data.endDate) : new Date(),
          }

          form.reset({
            title: formattedData.title,
            slug: formattedData.slug,
            status: formattedData.status === 'En cours' || formattedData.status === 'en_cours' ? 'En cours' : 'À venir',
            startDate: formattedData.startDate,
            endDate: formattedData.endDate,
            location: formattedData.location || "",
            description: formattedData.description || [""],
            apartmentTypes: formattedData.apartmentTypes || [],
            amenities: formattedData.amenities || [],
            brochureUrl: formattedData.brochureUrl || "",
            plans: formattedData.plans || [],
            gallery: formattedData.gallery || {},
            image_cover: formattedData.image_cover || "",
            image_cover_public_id: formattedData.image_cover_public_id || "",
            image_banner: formattedData.image_banner || "",
            image_banner_public_id: formattedData.image_banner_public_id || "",
            brochure_public_id: formattedData.brochure_public_id || "",
          })
          setCoverImage(formattedData.image_cover || null)
          setBannerImage(formattedData.image_banner || null)
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

  const steps = [
    { id: "general", label: "Général" },
    { id: "media", label: "Médias" },
    { id: "content", label: "Contenu" },
    { id: "amenities", label: "Commodités" },
    { id: "plans", label: "Plans" },
    { id: "gallery", label: "Galerie" },
  ]

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)

    try {
      // Préparer les données pour l'API
      const formattedData = {
        ...data,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
      }

      // Déterminer si c'est une création ou une mise à jour
      const url = id ? `/api/residences/${id}` : "/api/residences"
      const method = id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serializeBigInt(formattedData)),
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
        <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8 h-auto p-1 bg-muted">
            {steps.map((step) => (
              <TabsTrigger key={step.id} value={step.id} className="py-2 px-1 text-xs md:text-sm">
                {step.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="general" className="space-y-4">
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
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
                                  {field.value ? format(field.value, "PP", { locale: fr }) : <span>Date</span>}
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
                          <FormLabel>Date de livraison</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                >
                                  {field.value ? format(field.value, "PP", { locale: fr }) : <span>Date</span>}
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-6">Médias Principaux</h2>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <FormLabel>Image de Couverture</FormLabel>
                    <div className="space-y-4">
                      <div className="relative group">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          disabled={isUploadingFile}
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const result = await uploadFile(file)
                              if (result.success) {
                                setCoverImage(result.url)
                                form.setValue("image_cover", result.url)
                                toast({ title: "Image mise à jour", description: "L'image de couverture a été téléchargée." })
                              }
                            }
                          }}
                        />
                        <div className={`
                          relative w-full aspect-[3/1] max-h-48 rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center overflow-hidden
                          ${isUploadingFile ? 'bg-muted/50 border-muted' : 'border-muted-foreground/20 group-hover:border-primary/50 group-hover:bg-primary/5'}
                        `}>
                          {coverImage ? (
                            <>
                              <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="bg-white/90 p-2 rounded-full shadow-lg">
                                  <Upload className="h-5 w-5 text-slate-900" />
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center gap-1 p-4">
                              <div className="p-2 bg-background rounded-full shadow-sm border">
                                <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                              <div className="text-center">
                                <p className="text-xs font-semibold">Image de couverture</p>
                                <p className="text-[10px] text-muted-foreground">Cliquez ou glissez une image</p>
                              </div>
                            </div>
                          )}

                          {isUploadingFile && (
                            <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-2 z-20 backdrop-blur-[2px]">
                              <Loader2 className="h-8 w-8 text-primary animate-spin" />
                              <span className="text-xs font-bold text-primary uppercase tracking-widest animate-pulse">Envoi en cours...</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground italic flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-slate-400" />
                        Cette image sera utilisée comme bannière principale et sur les cartes de projets.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <FormLabel>Image de Bannière (Détail Projet)</FormLabel>
                    <div className="space-y-4">
                      <div className="relative group">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          disabled={isUploadingFile}
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const result = await uploadFile(file)
                              if (result.success) {
                                setBannerImage(result.url)
                                form.setValue("image_banner", result.url)
                                toast({ title: "Image mise à jour", description: "L'image de bannière a été téléchargée." })
                              }
                            }
                          }}
                        />
                        <div className={`
                          relative w-full aspect-[4/1] max-h-40 rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center overflow-hidden
                          ${isUploadingFile ? 'bg-muted/50 border-muted' : 'border-muted-foreground/20 group-hover:border-primary/50 group-hover:bg-primary/5'}
                        `}>
                          {bannerImage ? (
                            <>
                              <img src={bannerImage} alt="Banner preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="bg-white/90 p-2 rounded-full shadow-lg">
                                  <Upload className="h-5 w-5 text-slate-900" />
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center gap-1 p-4">
                              <div className="p-2 bg-background rounded-full shadow-sm border">
                                <Upload className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                              <div className="text-center">
                                <p className="text-xs font-semibold">Image de bannière</p>
                                <p className="text-[10px] text-muted-foreground">Cliquez ou glissez une image</p>
                              </div>
                            </div>
                          )}

                          {isUploadingFile && (
                            <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-2 z-20 backdrop-blur-[2px]">
                              <Loader2 className="h-8 w-8 text-primary animate-spin" />
                              <span className="text-xs font-bold text-primary uppercase tracking-widest animate-pulse">Envoi en cours...</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground italic flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-slate-400" />
                        Cette image sera affichée en haut de la page de détails du projet sur le site public.
                      </p>
                    </div>
                  </div>

                  <hr className="my-6 border-slate-100" />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="brochureUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brochure PDF (Présentation commerciale)</FormLabel>
                          <div className="flex flex-col gap-3">
                            <div className="flex gap-2">
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="URL du PDF ou téléchargez un fichier..."
                                  className="flex-1"
                                />
                              </FormControl>
                              {field.value && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => window.open(field.value, '_blank')}
                                  title="Ouvrir le PDF"
                                >
                                  <ArrowRight className="h-4 w-4 -rotate-45" />
                                </Button>
                              )}
                            </div>

                            <div className="relative group/file">
                              <Input
                                type="file"
                                accept=".pdf"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    const result = await uploadFile(file)
                                    if (result.success) {
                                      form.setValue("brochureUrl", result.url)
                                      toast({ title: "Brochure mise à jour", description: "Le fichier PDF a été téléchargé." })
                                    }
                                  }
                                }}
                              />
                              <div className="flex items-center gap-3 p-3 border-2 border-dashed border-muted-foreground/20 rounded-lg group-hover/file:border-primary/50 transition-colors bg-muted/30">
                                <div className="p-2 bg-background rounded-md shadow-sm border">
                                  {isUploadingFile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 text-muted-foreground" />}
                                </div>
                                <div className="flex-1 text-sm">
                                  <p className="font-medium">
                                    {isUploadingFile ? "Téléchargement..." : field.value ? "Remplacer la brochure" : "Cliquez pour uploader le PDF"}
                                  </p>
                                  {field.value && <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">{field.value.split('/').pop()}</p>}
                                </div>
                              </div>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-6">Contenu & Typologies</h2>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mb-8">
                      <FormLabel>Paragraphes de présentation</FormLabel>
                      <div className="space-y-3">
                        {field.value.map((paragraph, index) => (
                          <div key={index} className="flex gap-2">
                            <Textarea
                              value={paragraph}
                              onChange={(e) => {
                                const newValue = [...field.value]
                                newValue[index] = e.target.value
                                field.onChange(newValue)
                              }}
                              placeholder={`Paragraphe ${index + 1}`}
                              className="min-h-[80px]"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
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
                        <Button type="button" variant="outline" size="sm" onClick={() => field.onChange([...field.value, ""])}>
                          <Plus className="h-4 w-4 mr-2" /> Ajouter un paragraphe
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />

                <hr className="my-8 border-slate-100" />

                <FormField
                  control={form.control}
                  name="apartmentTypes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Typologies des appartements</FormLabel>
                      <FormControl>
                        <DynamicList
                          items={field.value || []}
                          onChange={field.onChange}
                          placeholder="Ex: 11 studios F1, 9 appartements F4..."
                          addButtonText="Ajouter une typologie"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setCurrentStep("media")}>
                Précédent
              </Button>
              <Button type="button" onClick={() => setCurrentStep("amenities")}>
                Suivant : Commodités
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="amenities" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Commodités & Équipements</h2>
                <FormField
                  control={form.control}
                  name="amenities"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <DynamicList
                          items={field.value || []}
                          onChange={field.onChange}
                          placeholder="Ex: Piscine surveillée, Conciergerie 24/7..."
                          addButtonText="Ajouter une commodité"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Plans PDF</h2>
                <FormField
                  control={form.control}
                  name="plans"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <PlanDocumentManager plans={field.value || []} onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Galerie d'images</h2>
                <FormField
                  control={form.control}
                  name="gallery"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageGallery gallery={field.value || {}} onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Persistent Footer with Actions */}
          <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t p-4 mt-8 flex items-center justify-between z-10 rounded-b-lg">
            <div className="flex gap-2">
              {currentStep !== "general" && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const stepIdx = steps.findIndex(s => s.id === currentStep);
                    if (stepIdx > 0) setCurrentStep(steps[stepIdx - 1].id);
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              {currentStep !== "gallery" && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const stepIdx = steps.findIndex(s => s.id === currentStep);
                    if (stepIdx < steps.length - 1) setCurrentStep(steps[stepIdx + 1].id);
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                className="text-slate-500 hover:text-slate-700"
                onClick={() => router.push("/admin/residences")}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-fulser-blue hover:bg-slate-800 text-white min-w-[140px]">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </div>
        </Tabs>
      </form>
    </Form>
  )
}

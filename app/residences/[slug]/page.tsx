import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, FileText, Calendar } from "lucide-react"

// Sample data - in a real app, this would come from an API or database
const sampleResidences = [
  {
    id: "1",
    title: "Les Jardins de Montmartre",
    slug: "jardins-montmartre",
    status: "En cours",
    startDate: "2023-06-01",
    endDate: "2024-12-31",
    location: "https://maps.google.com/?q=Montmartre,Paris",
    description: [
      "Une résidence de luxe située au cœur de Montmartre, offrant une vue imprenable sur Paris.",
      "Architecture moderne et élégante, conçue pour s'intégrer parfaitement dans le paysage urbain historique.",
    ],
    apartmentTypes: ["11 studios F1", "8 appartements F2", "5 appartements F3", "1 Penthouse de 5 chambres"],
    amenities: [
      "Piscine sur la terrasse",
      "Salle de sport avec sauna",
      "Jardin commun",
      "Service de conciergerie 24/7",
    ],
    brochureUrl: "https://example.com/brochure.pdf",
    plans: [
      {
        id: "plan1",
        title: "Plan d'étage - Niveau 1",
        fileUrl: "https://example.com/plans/etage1.pdf",
        thumbnailUrl: "/floor-plan-level-1.png",
      },
      {
        id: "plan2",
        title: "Plan d'étage - Niveau 2",
        fileUrl: "https://example.com/plans/etage2.pdf",
        thumbnailUrl: "/floor-plan-level-2.png",
      },
    ],
    gallery: {
      STUDIOS: ["/modern-studio-apartment.png"],
      PENTHOUSE: ["/luxury-penthouse.png"],
      EXTÉRIEUR: ["/modern-building-exterior.png"],
    },
  },
  {
    id: "2",
    title: "Le Clos Saint-Michel",
    slug: "clos-saint-michel",
    status: "À venir",
    startDate: "2024-03-15",
    endDate: "2025-09-30",
    location: "https://maps.google.com/?q=Saint-Michel,Paris",
    description: [
      "Une résidence familiale dans un quartier calme et verdoyant.",
      "Espaces de vie généreux et lumineux, conçus pour le confort moderne.",
    ],
    apartmentTypes: ["15 appartements F2", "12 appartements F3", "6 appartements F4"],
    amenities: ["Aire de jeux pour enfants", "Parking souterrain", "Local à vélos", "Espaces verts aménagés"],
    brochureUrl: "https://example.com/brochure2.pdf",
    plans: [
      {
        id: "plan1",
        title: "Plan d'étage - Niveau 1",
        fileUrl: "https://example.com/plans/etage1.pdf",
        thumbnailUrl: "/floor-plan-level-1.png",
      },
      {
        id: "plan2",
        title: "Plan d'étage - Niveau 2",
        fileUrl: "https://example.com/plans/etage2.pdf",
        thumbnailUrl: "/floor-plan-level-2.png",
      },
    ],
    gallery: {
      APPARTEMENTS: ["/modern-apartment.png"],
      HALL: ["/elegant-building-entrance.png"],
      JARDINS: ["/landscaped-garden.png"],
    },
  },
  {
    id: "3",
    title: "Résidence Belle Vue",
    slug: "residence-belle-vue",
    status: "En cours",
    startDate: "2023-09-01",
    endDate: "2024-08-31",
    location: "https://maps.google.com/?q=Belleville,Paris",
    description: [
      "Une résidence contemporaine avec vue panoramique sur la ville.",
      "Design intérieur soigné et matériaux de haute qualité.",
    ],
    apartmentTypes: ["8 studios F1", "10 appartements F2", "6 duplex F3/F4"],
    amenities: ["Terrasses privatives", "Système domotique", "Sécurité 24/7", "Ascenseur"],
    brochureUrl: "https://example.com/brochure3.pdf",
    plans: [
      {
        id: "plan1",
        title: "Plan d'étage - Niveau 1",
        fileUrl: "https://example.com/plans/etage1.pdf",
        thumbnailUrl: "/floor-plan-level-1.png",
      },
      {
        id: "plan2",
        title: "Plan d'étage - Niveau 2",
        fileUrl: "https://example.com/plans/etage2.pdf",
        thumbnailUrl: "/floor-plan-level-2.png",
      },
    ],
    gallery: {
      STUDIOS: ["/compact-studio-apartment.png"],
      DUPLEX: ["/modern-duplex-apartment.png"],
      VUE: ["/city-panoramic-view.png"],
    },
  },
]

export default function ResidencePage({ params }: { params: { slug: string } }) {
  const residence = sampleResidences.find((r) => r.slug === params.slug)

  if (!residence) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Résidence non trouvée</h1>
        <p className="mb-6">La résidence que vous recherchez n'existe pas.</p>
        <Link href="/">
          <Button>Retour à l'accueil</Button>
        </Link>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  const galleryCategories = Object.keys(residence.gallery)

  return (
    <div className="container py-12">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold">{residence.title}</h1>
          <Badge variant={residence.status === "En cours" ? "success" : "info"}>{residence.status}</Badge>
        </div>

        <div className="flex items-center gap-6 text-muted-foreground mb-6">
          {residence.location && (
            <Link href={residence.location} target="_blank" className="flex items-center gap-1 hover:text-foreground">
              <MapPin className="h-4 w-4" />
              Voir sur la carte
            </Link>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(residence.startDate)} - {formatDate(residence.endDate)}
          </div>
          {residence.brochureUrl && (
            <Link
              href={residence.brochureUrl}
              target="_blank"
              className="flex items-center gap-1 hover:text-foreground"
            >
              <FileText className="h-4 w-4" />
              Télécharger la brochure
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <div className="space-y-4">
                {residence.description.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          {residence.plans && residence.plans.length > 0 && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Plans</h2>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {residence.plans.map((plan) => (
                    <a
                      key={plan.id}
                      href={plan.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <div className="aspect-[3/4] relative bg-muted rounded-md overflow-hidden border">
                        {plan.thumbnailUrl ? (
                          <Image
                            src={plan.thumbnailUrl || "/placeholder.svg"}
                            alt={plan.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <FileText className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button>
                            <FileText className="h-4 w-4 mr-2" />
                            Voir le PDF
                          </Button>
                        </div>
                      </div>
                      <h3 className="mt-2 font-medium text-center">{plan.title}</h3>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Galerie</h2>
            {galleryCategories.length > 0 ? (
              <Tabs defaultValue={galleryCategories[0]}>
                <TabsList className="mb-4">
                  {galleryCategories.map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {galleryCategories.map((category) => (
                  <TabsContent key={category} value={category}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {residence.gallery[category].map((imageUrl, index) => (
                        <div key={index} className="aspect-video relative overflow-hidden rounded-md border">
                          <Image
                            src={imageUrl || "/placeholder.svg"}
                            alt={`${residence.title} - ${category} ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <p className="text-muted-foreground">Aucune image disponible</p>
            )}
          </div>
        </div>

        <div>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Typologies</h2>
              {residence.apartmentTypes && residence.apartmentTypes.length > 0 ? (
                <ul className="space-y-2">
                  {residence.apartmentTypes.map((type, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      {type}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Aucune typologie disponible</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Commodités</h2>
              {residence.amenities && residence.amenities.length > 0 ? (
                <ul className="space-y-2">
                  {residence.amenities.map((amenity, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      {amenity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Aucune commodité disponible</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

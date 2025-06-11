import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"

// Sample data - in a real app, this would come from an API or database
const sampleArticles = [
  {
    id: "1",
    title: "Les tendances immobilières à Paris en 2024",
    slug: "tendances-immobilieres-paris-2024",
    image: "/article-real-estate-trends.png",
    excerpt: "Découvrez les dernières tendances du marché immobilier parisien et les quartiers en pleine expansion.",
    publishedAt: "2024-03-15",
    author: "Sophie Martin",
  },
  {
    id: "2",
    title: "Comment choisir son premier appartement",
    slug: "comment-choisir-premier-appartement",
    image: "/article-first-apartment.png",
    excerpt:
      "Guide complet pour les primo-accédants : critères essentiels et pièges à éviter lors de l'achat de votre premier logement.",
    publishedAt: "2024-02-20",
    author: "Thomas Dubois",
  },
  {
    id: "3",
    title: "Rénovation énergétique : les nouvelles normes 2024",
    slug: "renovation-energetique-nouvelles-normes-2024",
    image: "/article-energy-renovation.png",
    excerpt:
      "Les changements réglementaires en matière d'efficacité énergétique et leur impact sur le marché immobilier résidentiel.",
    publishedAt: "2024-01-10",
    author: "Claire Rousseau",
  },
]

export default function ArticlesPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Actualités Immobilières</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleArticles.map((article) => (
          <Card key={article.id} className="overflow-hidden flex flex-col">
            <div className="aspect-video relative">
              <Image
                src={article.image || "/placeholder.svg?height=225&width=400&query=article"}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="pt-6 flex-1">
              <h2 className="text-xl font-bold mb-2">
                <Link href={`/articles/${article.slug}`} className="hover:underline">
                  {article.title}
                </Link>
              </h2>
              <p className="text-muted-foreground mb-4">{article.excerpt}</p>
            </CardContent>
            <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
              <div className="flex justify-between w-full">
                <span>{article.author}</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

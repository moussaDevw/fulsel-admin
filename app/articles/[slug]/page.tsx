import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"

// Sample data - in a real app, this would come from an API or database
const sampleArticles = [
  {
    id: "1",
    title: "Les tendances immobilières à Paris en 2024",
    slug: "tendances-immobilieres-paris-2024",
    image: "/article-real-estate-trends.png",
    excerpt: "Découvrez les dernières tendances du marché immobilier parisien et les quartiers en pleine expansion.",
    content: `Le marché immobilier parisien continue d'évoluer en 2024, avec plusieurs tendances notables qui façonnent le paysage urbain et les opportunités d'investissement.

Les quartiers en pleine transformation
Plusieurs quartiers connaissent une métamorphose significative, notamment le nord-est parisien qui attire de plus en plus d'investisseurs et de nouveaux résidents. Les 18ème, 19ème et 20ème arrondissements offrent encore des prix au mètre carré plus accessibles tout en bénéficiant d'une dynamique de développement soutenue.

L'impact des Jeux Olympiques
L'héritage des Jeux Olympiques de 2024 se fait déjà sentir sur le marché immobilier. Les infrastructures améliorées et les nouveaux aménagements urbains ont revalorisé certains secteurs, particulièrement autour des sites olympiques.

La demande croissante pour les espaces extérieurs
Suite aux changements d'habitudes post-pandémie, les biens disposant d'un espace extérieur (balcon, terrasse ou jardin) continuent de commander une prime significative. Cette tendance ne montre aucun signe de ralentissement.

Le retour des investisseurs étrangers
Après une période de repli, les investisseurs internationaux reviennent sur le marché parisien, attirés par la stabilité relative des prix et les perspectives de valorisation à long terme dans la capitale française.`,
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
    content: `L'achat d'un premier appartement représente une étape importante dans la vie. Voici un guide pour vous aider à faire le bon choix.

Définir son budget réel
Avant toute recherche, établissez précisément votre capacité d'emprunt et n'oubliez pas d'inclure les frais annexes : frais de notaire, travaux éventuels, taxe foncière, charges de copropriété, etc.

Identifier ses besoins essentiels
Distinguez vos besoins non négociables de vos préférences : proximité des transports, nombre de pièces, étage, luminosité, etc. Cela vous permettra de rester focalisé sur l'essentiel lors de vos visites.

Évaluer le quartier
Au-delà du logement lui-même, le quartier détermine grandement votre qualité de vie quotidienne. Visitez-le à différentes heures de la journée pour évaluer l'ambiance, le bruit, la sécurité et les commodités disponibles.

Inspecter minutieusement le bien
Portez attention aux détails techniques : état général de l'immeuble, isolation phonique et thermique, installation électrique, plomberie, etc. N'hésitez pas à faire appel à un professionnel pour une contre-visite technique.

Se projeter à long terme
Même s'il s'agit d'un premier achat, pensez à la revente future. Un appartement bien situé, dans un quartier dynamique, conservera mieux sa valeur et sera plus facile à revendre si vos besoins évoluent.`,
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
    content: `Les nouvelles réglementations en matière de performance énergétique transforment profondément le secteur immobilier en 2024.

Le renforcement du DPE
Le Diagnostic de Performance Énergétique (DPE) joue désormais un rôle central dans les transactions immobilières. Les logements classés F et G (passoires thermiques) font l'objet de restrictions croissantes, avec des conséquences directes sur leur valeur marchande et leur location.

Les aides financières disponibles
Pour accompagner les propriétaires dans leurs travaux de rénovation, plusieurs dispositifs d'aide ont été renforcés : MaPrimeRénov', éco-prêt à taux zéro, TVA réduite, etc. Ces aides peuvent couvrir une part significative du coût des travaux selon les revenus du foyer.

Les solutions techniques privilégiées
L'isolation thermique reste la priorité (toiture, murs, fenêtres), suivie par la modernisation des systèmes de chauffage. Les pompes à chaleur et les systèmes hybrides connaissent un succès croissant, soutenus par des incitations fiscales avantageuses.

L'impact sur les prix de l'immobilier
Un écart de prix se creuse entre les biens énergétiquement performants et les passoires thermiques. Cette tendance devrait s'accentuer avec le durcissement progressif de la réglementation, créant de nouvelles opportunités pour les investisseurs prêts à entreprendre des rénovations.`,
    publishedAt: "2024-01-10",
    author: "Claire Rousseau",
  },
]

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = sampleArticles.find((a) => a.slug === params.slug)

  if (!article) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
        <p className="mb-6">L'article que vous recherchez n'existe pas.</p>
        <Link href="/articles">
          <Button>Retour aux articles</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <Link href="/articles" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux articles
      </Link>

      <div className="aspect-[21/9] relative mb-8 rounded-lg overflow-hidden">
        <Image
          src={article.image || "/placeholder.svg?height=600&width=1200&query=article"}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>

        <div className="flex items-center text-muted-foreground mb-8">
          <span>Par {article.author}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>

        <div className="prose prose-lg max-w-none whitespace-pre-line">{article.content}</div>
      </div>
    </div>
  )
}

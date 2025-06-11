"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { formatDate } from "@/lib/utils"

interface Article {
  id: string
  title: string
  slug: string
  image: string
  excerpt: string
  published_at: string
  author: string
}

export function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  // Charger les articles depuis l'API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/articles")
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des articles")
        }
        const data = await response.json()
        setArticles(data)
      } catch (error) {
        console.error("Erreur:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les articles",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [toast])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'article")
      }

      setArticles(articles.filter((article) => article.id !== id))

      toast({
        title: "Article supprimé",
        description: "L'article a été supprimé avec succès.",
      })
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="py-8 text-center">Chargement des articles...</div>
  }

  if (articles.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="mb-4 text-muted-foreground">Aucun article trouvé</p>
        <Link href="/admin/articles/new">
          <Button>Créer un article</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {articles.map((article) => (
        <Card key={article.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center p-4">
              <div className="relative h-20 w-32 overflow-hidden rounded-md">
                <Image
                  src={article.image || "/placeholder.svg?height=80&width=128&query=article"}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold">{article.title}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Publié le {formatDate(article.published_at)} par {article.author}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/articles/${article.id}`}>
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Modifier</span>
                  </Button>
                </Link>
                <Link href={`/articles/${article.slug}`}>
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Aperçu</span>
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action ne peut pas être annulée. Cela supprimera définitivement l'article "{article.title}
                        " et toutes ses données associées.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(article.id)}>Supprimer</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

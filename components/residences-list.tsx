"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

interface Residence {
  id: string
  title: string
  slug: string
  status: string
  start_date: string
  end_date: string
  thumbnail?: string
}

export function ResidencesList() {
  const [residences, setResidences] = useState<Residence[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  // Charger les résidences depuis l'API
  useEffect(() => {
    const fetchResidences = async () => {
      try {
        const response = await fetch("/api/residences")
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des résidences")
        }
        const data = await response.json()
        setResidences(data)
      } catch (error) {
        console.error("Erreur:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les résidences",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchResidences()
  }, [toast])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/residences/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la résidence")
      }

      setResidences(residences.filter((residence) => residence.id !== id))

      toast({
        title: "Résidence supprimée",
        description: "La résidence a été supprimée avec succès.",
      })
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la résidence",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR").format(date)
  }

  if (isLoading) {
    return <div className="py-8 text-center">Chargement des résidences...</div>
  }

  if (residences.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="mb-4 text-muted-foreground">Aucune résidence trouvée</p>
        <Link href="/admin/residences/new">
          <Button>Créer une résidence</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {residences.map((residence) => (
        <Card key={residence.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center p-4">
              <div className="relative h-20 w-32 overflow-hidden rounded-md">
                <Image
                  src={residence.thumbnail || "/placeholder.svg?height=80&width=128&query=building"}
                  alt={residence.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold">{residence.title}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant={residence.status === "En cours" ? "success" : "info"}>{residence.status}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(residence.start_date)} - {formatDate(residence.end_date)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/residences/${residence.id}`}>
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Modifier</span>
                  </Button>
                </Link>
                <Link href={`/residences/${residence.slug}`}>
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
                        Cette action ne peut pas être annulée. Cela supprimera définitivement la résidence "
                        {residence.title}" et toutes ses données associées.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(residence.id)}>Supprimer</AlertDialogAction>
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

"use client"

import { useState, useEffect } from "react"
import { UserForm } from "@/components/user-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/admin/users/${params.id}`)
        if (!response.ok) throw new Error("User not found")
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error(error)
        toast({
          title: "Erreur",
          description: "Utilisateur non trouvé",
          variant: "destructive",
        })
        router.push("/admin/users")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchUser()
    }
  }, [params.id, router, toast])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Modifier l'Utilisateur</h1>
          <p className="text-slate-500">Mise à jour du profil de {user?.name}.</p>
        </div>
      </div>

      <UserForm id={params.id as string} initialData={user} />
    </div>
  )
}

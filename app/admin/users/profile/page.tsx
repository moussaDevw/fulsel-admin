"use client"

import { useState, useEffect } from "react"
import { UserForm } from "@/components/user-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function UserProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // In a real app, we'd get the current user ID from the session
  // For now, we'll fetch a "me" endpoint or assume ID 1 for testing
  // Since we don't have a secure "me" yet, let's fetch the first user or something
  // Or just use a placeholder if we can't determine current user easily
  
  useEffect(() => {
    const fetchMe = async () => {
      try {
        // Mocking fetching the current user
        const response = await fetch("/api/admin/users")
        if (!response.ok) throw new Error("Failed to fetch")
        const users = await response.json()
        if (users.length > 0) {
          // Get the first user as "me" for demonstration
          const res = await fetch(`/api/admin/users/${users[0].id}`)
          const data = await res.json()
          setUser(data)
        }
      } catch (error) {
        console.error(error)
        toast({
          title: "Erreur",
          description: "Impossible de charger votre profil",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMe()
  }, [toast])

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
          <h1 className="text-2xl font-bold text-slate-900">Mon Profil</h1>
          <p className="text-slate-500">Gérez vos informations personnelles et votre compte.</p>
        </div>
      </div>

      {user && <UserForm id={user.id} initialData={user} isProfile={true} />}
    </div>
  )
}

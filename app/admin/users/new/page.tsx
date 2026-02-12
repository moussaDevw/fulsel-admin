"use client"

import { UserForm } from "@/components/user-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NewUserPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nouvel Utilisateur</h1>
          <p className="text-slate-500">Ajouter un nouveau membre à l'équipe FULSER PROPS.</p>
        </div>
      </div>

      <UserForm />
    </div>
  )
}

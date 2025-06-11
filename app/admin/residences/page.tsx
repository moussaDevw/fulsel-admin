import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ResidencesList } from "@/components/residences-list"

export default function ResidencesPage() {
  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">L'Inventaire des Résidences</h1>
        <Link href="/admin/residences/new">
          <Button>Nouvelle Résidence</Button>
        </Link>
      </div>
      <div className="mt-6">
        <ResidencesList />
      </div>
    </div>
  )
}

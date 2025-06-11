import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">Résidences Admin</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
            <div className="flex gap-2">
              <Link href="/admin/residences/new">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nouvelle Résidence
                </Button>
              </Link>
              <Link href="/admin/articles/new">
                <Button variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nouvel Article
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Link href="/admin/residences" className="block">
              <div className="rounded-lg border p-6 hover:bg-muted/50 transition-colors">
                <h2 className="text-xl font-semibold mb-2">Gestion des Résidences</h2>
                <p className="text-muted-foreground">
                  Gérez vos projets immobiliers, leurs caractéristiques et leurs galeries d'images.
                </p>
              </div>
            </Link>
            <Link href="/admin/articles" className="block">
              <div className="rounded-lg border p-6 hover:bg-muted/50 transition-colors">
                <h2 className="text-xl font-semibold mb-2">Gestion des Articles</h2>
                <p className="text-muted-foreground">
                  Publiez et gérez des articles d'actualité sur le marché immobilier et vos projets.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

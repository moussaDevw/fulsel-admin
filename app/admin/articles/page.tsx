import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArticlesList } from "@/components/articles-list"

export default function ArticlesPage() {
  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Gestion des Articles</h1>
        <Link href="/admin/articles/new">
          <Button>Nouvel Article</Button>
        </Link>
      </div>
      <div className="mt-6">
        <ArticlesList />
      </div>
    </div>
  )
}

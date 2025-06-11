import { ArticleForm } from "@/components/article-form"

export default function NewArticlePage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold tracking-tight">Créer un Nouvel Article</h1>
      <div className="mt-6">
        <ArticleForm />
      </div>
    </div>
  )
}

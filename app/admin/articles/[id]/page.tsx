import { ArticleForm } from "@/components/article-form"

export default function EditArticlePage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold tracking-tight">Modifier l'Article</h1>
      <div className="mt-6">
        <ArticleForm id={params.id} />
      </div>
    </div>
  )
}

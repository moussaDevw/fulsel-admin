import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug

    const [article] = await sql`
      SELECT id, title, slug, image, excerpt, content, published_at, author
      FROM articles
      WHERE slug = ${slug}
    `

    if (!article) {
      return NextResponse.json({ error: "Article non trouvé" }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération de l'article" }, { status: 500 })
  }
}

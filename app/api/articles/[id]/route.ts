import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const [article] = await sql`
      SELECT id, title, slug, image, excerpt, content, published_at, author
      FROM articles
      WHERE id = ${id}
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Vérifier si l'article existe
    const [existingArticle] = await sql`
      SELECT id FROM articles WHERE id = ${id}
    `

    if (!existingArticle) {
      return NextResponse.json({ error: "Article non trouvé" }, { status: 404 })
    }

    // Mettre à jour l'article
    await sql`
      UPDATE articles
      SET title = ${body.title},
          slug = ${body.slug},
          image = ${body.image},
          excerpt = ${body.excerpt},
          content = ${body.content},
          published_at = ${body.publishedAt},
          author = ${body.author},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    return NextResponse.json({ id, message: "Article mis à jour avec succès" })
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'article:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de l'article" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Vérifier si l'article existe
    const [existingArticle] = await sql`
      SELECT id FROM articles WHERE id = ${id}
    `

    if (!existingArticle) {
      return NextResponse.json({ error: "Article non trouvé" }, { status: 404 })
    }

    // Supprimer l'article
    await sql`DELETE FROM articles WHERE id = ${id}`

    return NextResponse.json({ message: "Article supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression de l'article" }, { status: 500 })
  }
}

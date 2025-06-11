import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const articles = await sql`
      SELECT id, title, slug, image, excerpt, published_at, author
      FROM articles
      ORDER BY published_at DESC
    `

    return NextResponse.json(articles)
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des articles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const [article] = await sql`
      INSERT INTO articles (
        title, slug, image, excerpt, content, published_at, author
      ) VALUES (
        ${body.title}, ${body.slug}, ${body.image}, ${body.excerpt}, 
        ${body.content}, ${body.publishedAt}, ${body.author}
      )
      RETURNING id, title, slug, image, excerpt, published_at, author
    `

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de l'article:", error)
    return NextResponse.json({ error: "Erreur lors de la création de l'article" }, { status: 500 })
  }
}

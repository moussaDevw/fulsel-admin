import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug

    const article = await prisma.articles.findUnique({
      where: {
        slug: slug
      },
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        excerpt: true,
        content: true,
        published_at: true,
        author: true
      }
    })

    if (!article) {
      return NextResponse.json({ error: "Article non trouvé" }, { status: 404 })
    }

    const serialized = JSON.parse(JSON.stringify(article, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json(serialized)
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération de l'article" }, { status: 500 })
  }
}

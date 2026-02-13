import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const article = await prisma.articles.findUnique({
      where: {
        id: BigInt(id)
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Vérifier si l'article existe (optionnel car update échouera, mais permet un 404 propre)
    const existingArticle = await prisma.articles.findUnique({
      where: { id: BigInt(id) },
      select: { id: true }
    })

    if (!existingArticle) {
      return NextResponse.json({ error: "Article non trouvé" }, { status: 404 })
    }

    // Mettre à jour l'article
    const updatedArticle = await prisma.articles.update({
      where: {
        id: BigInt(id)
      },
      data: {
        title: body.title,
        slug: body.slug,
        image: body.image,
        excerpt: body.excerpt,
        content: body.content,
        published_at: body.published_at ? new Date(body.published_at) : (body.publishedAt ? new Date(body.publishedAt) : null), // Handle both cases just in case
        author: body.author
      }
    })

    const serialized = JSON.parse(JSON.stringify(updatedArticle, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json({ id, message: "Article mis à jour avec succès", article: serialized })
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'article:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de l'article" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const existingArticle = await prisma.articles.findUnique({
      where: { id: BigInt(id) },
      select: { id: true }
    })

    if (!existingArticle) {
      return NextResponse.json({ error: "Article non trouvé" }, { status: 404 })
    }

    await prisma.articles.delete({
      where: {
        id: BigInt(id)
      }
    })

    return NextResponse.json({ message: "Article supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression de l'article" }, { status: 500 })
  }
}

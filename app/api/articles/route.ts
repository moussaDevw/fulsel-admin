import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const articles = await prisma.articles.findMany({
      orderBy: {
        published_at: 'desc'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        excerpt: true,
        published_at: true,
        author: true
      }
    })

    const serialized = JSON.parse(JSON.stringify(articles, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json(serialized)
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des articles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const article = await prisma.articles.create({
      data: {
        title: body.title,
        slug: body.slug,
        image: body.image,
        excerpt: body.excerpt,
        content: body.content,
        published_at: body.publishedAt ? new Date(body.publishedAt) : null,
        author: body.author
      },
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        excerpt: true,
        published_at: true,
        author: true
      }
    })

    const serialized = JSON.parse(JSON.stringify(article, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json(serialized, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de l'article:", error)
    return NextResponse.json({ error: "Erreur lors de la création de l'article" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const residences = await prisma.residences.findMany({
      orderBy: {
        created_at: 'desc'
      }
    })

    // Convert bigints to strings
    const serialized = JSON.parse(JSON.stringify(residences, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json(serialized)
  } catch (error) {
    console.error("Erreur lors de la récupération des résidences:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des résidences" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Create residence with nested relations
    const residence = await prisma.residences.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-"),
        image_cover: body.image_cover || null,
        image_banner: body.image_banner || null,
        status: body.status === "En cours" || body.status === "en_cours" ? "en_cours" : "venir",
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        location: body.location || null,
        brochureUrl: body.brochureUrl || null,
        residence_descriptions: {
          create: (body.description || []).map((paragraph: string, index: number) => ({
            paragraph,
            position: index
          }))
        },
        residence_apartment_types: {
          create: (body.apartmentTypes || []).map((type: string, index: number) => ({
            name: type,
            position: index
          }))
        },
        residence_amenities: {
          create: (body.amenities || []).map((amenity: string, index: number) => ({
            name: amenity,
            position: index
          }))
        },
        residence_plans: {
          create: (body.plans || []).map((plan: any) => ({
            title: plan.title,
            url: plan.fileUrl,
            thumbnailUrl: plan.thumbnailUrl || null
          }))
        }
      }
    })

    // Handle gallery (more complex because of categories)
    if (body.gallery) {
      const categories = Object.keys(body.gallery)
      for (const categoryName of categories) {
        const category = await prisma.residence_gallery_categories.create({
          data: {
            residence_id: residence.id,
            name: categoryName
          }
        })

        const images = body.gallery[categoryName]
        if (images && images.length > 0) {
          await prisma.residence_gallery_images.createMany({
            data: images.map((imageUrl: string, index: number) => ({
              residence_id: residence.id,
              residence_gallery_category_id: category.id,
              url: imageUrl,
              position: index
            }))
          })
        }
      }
    }

    const serialized = JSON.parse(JSON.stringify(residence, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json(serialized, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de la résidence:", error)
    return NextResponse.json({ error: "Erreur lors de la création de la résidence", details: String(error) }, { status: 500 })
  }
}

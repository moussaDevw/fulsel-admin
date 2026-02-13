import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const residence = await prisma.residences.findUnique({
      where: { id: BigInt(id) },
      include: {
        residence_descriptions: { orderBy: { position: 'asc' } },
        residence_amenities: { orderBy: { position: 'asc' } },
        residence_apartment_types: { orderBy: { position: 'asc' } },
        residence_plans: true,
        residence_gallery_categories: {
          include: {
            residence_gallery_images: { orderBy: { position: 'asc' } }
          }
        }
      }
    })

    if (!residence) {
      return NextResponse.json({ error: "Résidence non trouvée" }, { status: 404 })
    }

    // Adapt to the format expected by the frontend
    const formattedData = {
      id: residence.id.toString(),
      title: residence.title,
      slug: residence.slug,
      status: residence.status === 'en_cours' ? 'En cours' : 'À venir',
      startDate: residence.startDate,
      endDate: residence.endDate,
      location: residence.location,
      brochureUrl: residence.brochureUrl,
      brochure_public_id: residence.brochure_public_id,
      image_cover: residence.image_cover,
      image_banner: residence.image_banner,
      description: residence.residence_descriptions.map(d => d.paragraph),
      amenities: residence.residence_amenities.map(a => a.name),
      apartmentTypes: residence.residence_apartment_types.map(t => t.name),
      plans: residence.residence_plans.map(p => ({
        id: p.id.toString(),
        title: p.title,
        fileUrl: p.url,
        thumbnailUrl: p.thumbnailUrl
      })),
      gallery: residence.residence_gallery_categories.reduce((acc, cat) => {
        acc[cat.name] = cat.residence_gallery_images.map(img => img.url)
        return acc
      }, {} as Record<string, string[]>)
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Erreur lors de la récupération de la résidence:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération de la résidence" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const residenceId = BigInt(id)



    // Delete existing relations to "re-create" them
    await prisma.$transaction([
      prisma.residence_descriptions.deleteMany({ where: { residence_id: residenceId } }),
      prisma.residence_amenities.deleteMany({ where: { residence_id: residenceId } }),
      prisma.residence_apartment_types.deleteMany({ where: { residence_id: residenceId } }),
      prisma.residence_plans.deleteMany({ where: { residence_id: residenceId } }),
      prisma.residences.update({
        where: { id: residenceId },
        data: {
          title: body.title,
          slug: body.slug,
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
    ])

    // Handle gallery update
    if (body.gallery) {
      const existingCategories = await prisma.residence_gallery_categories.findMany({
        where: { residence_id: residenceId }
      })

      for (const cat of existingCategories) {
        await prisma.residence_gallery_images.deleteMany({ where: { residence_gallery_category_id: cat.id } })
      }
      await prisma.residence_gallery_images.deleteMany({ where: { residence_id: residenceId } })
      await prisma.residence_gallery_categories.deleteMany({ where: { residence_id: residenceId } })

      const categories = Object.keys(body.gallery)
      for (const categoryName of categories) {
        const category = await prisma.residence_gallery_categories.create({
          data: {
            residence_id: residenceId,
            name: categoryName
          }
        })

        const images = body.gallery[categoryName]
        if (images && images.length > 0) {
          await prisma.residence_gallery_images.createMany({
            data: images.map((imageUrl: string, index: number) => ({
              residence_id: residenceId,
              residence_gallery_category_id: category.id,
              url: imageUrl,
              position: index
            }))
          })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la résidence:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la résidence" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const residenceId = BigInt(id)

    await prisma.$transaction(async (tx) => {
      await tx.residence_gallery_images.deleteMany({ where: { residence_id: residenceId } })
      await tx.residence_gallery_categories.deleteMany({ where: { residence_id: residenceId } })
      await tx.residence_descriptions.deleteMany({ where: { residence_id: residenceId } })
      await tx.residence_amenities.deleteMany({ where: { residence_id: residenceId } })
      await tx.residence_apartment_types.deleteMany({ where: { residence_id: residenceId } })
      await tx.residence_plans.deleteMany({ where: { residence_id: residenceId } })
      await tx.residences.delete({ where: { id: residenceId } })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de la résidence:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression de la résidence" }, { status: 500 })
  }
}

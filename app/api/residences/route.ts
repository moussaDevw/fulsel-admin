import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const residences = await sql`
      SELECT r.id, r.title, r.slug, r.status, r.start_date, r.end_date, r.location, r.brochure_url
      FROM residences r
      ORDER BY r.created_at DESC
    `

    return NextResponse.json(residences)
  } catch (error) {
    console.error("Erreur lors de la récupération des résidences:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des résidences" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Insérer la résidence principale
    const [residence] = await sql`
      INSERT INTO residences (
        title, slug, status, start_date, end_date, location, brochure_url
      ) VALUES (
        ${body.title}, ${body.slug}, ${body.status}, ${body.startDate}, ${body.endDate}, 
        ${body.location || null}, ${body.brochureUrl || null}
      )
      RETURNING id, title, slug, status, start_date, end_date, location, brochure_url
    `

    // Insérer les paragraphes de description
    if (body.description && body.description.length > 0) {
      await Promise.all(
        body.description.map((paragraph: string, index: number) => {
          return sql`
          INSERT INTO residence_descriptions (residence_id, paragraph, position)
          VALUES (${residence.id}, ${paragraph}, ${index})
        `
        }),
      )
    }

    // Insérer les types d'appartements
    if (body.apartmentTypes && body.apartmentTypes.length > 0) {
      await Promise.all(
        body.apartmentTypes.map((type: string, index: number) => {
          return sql`
          INSERT INTO residence_apartment_types (residence_id, type_name, position)
          VALUES (${residence.id}, ${type}, ${index})
        `
        }),
      )
    }

    // Insérer les commodités
    if (body.amenities && body.amenities.length > 0) {
      await Promise.all(
        body.amenities.map((amenity: string, index: number) => {
          return sql`
          INSERT INTO residence_amenities (residence_id, amenity_name, position)
          VALUES (${residence.id}, ${amenity}, ${index})
        `
        }),
      )
    }

    // Insérer les plans
    if (body.plans && body.plans.length > 0) {
      await Promise.all(
        body.plans.map((plan: any) => {
          return sql`
          INSERT INTO residence_plans (residence_id, title, file_url, thumbnail_url)
          VALUES (${residence.id}, ${plan.title}, ${plan.fileUrl}, ${plan.thumbnailUrl || null})
        `
        }),
      )
    }

    // Insérer les catégories de galerie et leurs images
    if (body.gallery) {
      const categories = Object.keys(body.gallery)

      for (const category of categories) {
        const [categoryRecord] = await sql`
          INSERT INTO residence_gallery_categories (residence_id, category_name)
          VALUES (${residence.id}, ${category})
          RETURNING id
        `

        const images = body.gallery[category]
        if (images && images.length > 0) {
          await Promise.all(
            images.map((imageUrl: string, index: number) => {
              return sql`
              INSERT INTO residence_gallery_images (category_id, image_url, position)
              VALUES (${categoryRecord.id}, ${imageUrl}, ${index})
            `
            }),
          )
        }
      }
    }

    return NextResponse.json(residence, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de la résidence:", error)
    return NextResponse.json({ error: "Erreur lors de la création de la résidence" }, { status: 500 })
  }
}

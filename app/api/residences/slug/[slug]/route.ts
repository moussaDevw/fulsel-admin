import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug

    // Récupérer la résidence principale par slug
    const [residence] = await sql`
      SELECT r.id, r.title, r.slug, r.status, r.start_date, r.end_date, r.location, r.brochure_url
      FROM residences r
      WHERE r.slug = ${slug}
    `

    if (!residence) {
      return NextResponse.json({ error: "Résidence non trouvée" }, { status: 404 })
    }

    // Récupérer les descriptions
    const descriptions = await sql`
      SELECT paragraph
      FROM residence_descriptions
      WHERE residence_id = ${residence.id}
      ORDER BY position
    `

    // Récupérer les types d'appartements
    const apartmentTypes = await sql`
      SELECT type_name
      FROM residence_apartment_types
      WHERE residence_id = ${residence.id}
      ORDER BY position
    `

    // Récupérer les commodités
    const amenities = await sql`
      SELECT amenity_name
      FROM residence_amenities
      WHERE residence_id = ${residence.id}
      ORDER BY position
    `

    // Récupérer les plans
    const plans = await sql`
      SELECT id, title, file_url, thumbnail_url
      FROM residence_plans
      WHERE residence_id = ${residence.id}
    `

    // Récupérer les catégories de galerie et leurs images
    const categories = await sql`
      SELECT id, category_name
      FROM residence_gallery_categories
      WHERE residence_id = ${residence.id}
    `

    const gallery: Record<string, string[]> = {}

    for (const category of categories) {
      const images = await sql`
        SELECT image_url
        FROM residence_gallery_images
        WHERE category_id = ${category.id}
        ORDER BY position
      `

      gallery[category.category_name] = images.map((img) => img.image_url)
    }

    // Construire l'objet résidence complet
    const completeResidence = {
      ...residence,
      description: descriptions.map((d) => d.paragraph),
      apartmentTypes: apartmentTypes.map((t) => t.type_name),
      amenities: amenities.map((a) => a.amenity_name),
      plans,
      gallery,
    }

    return NextResponse.json(completeResidence)
  } catch (error) {
    console.error("Erreur lors de la récupération de la résidence:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération de la résidence" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Récupérer la résidence principale
    const [residence] = await sql`
      SELECT r.id, r.title, r.slug, r.status, r.start_date, r.end_date, r.location, r.brochure_url
      FROM residences r
      WHERE r.id = ${id}
    `

    if (!residence) {
      return NextResponse.json({ error: "Résidence non trouvée" }, { status: 404 })
    }

    // Récupérer les descriptions
    const descriptions = await sql`
      SELECT paragraph
      FROM residence_descriptions
      WHERE residence_id = ${id}
      ORDER BY position
    `

    // Récupérer les types d'appartements
    const apartmentTypes = await sql`
      SELECT type_name
      FROM residence_apartment_types
      WHERE residence_id = ${id}
      ORDER BY position
    `

    // Récupérer les commodités
    const amenities = await sql`
      SELECT amenity_name
      FROM residence_amenities
      WHERE residence_id = ${id}
      ORDER BY position
    `

    // Récupérer les plans
    const plans = await sql`
      SELECT id, title, file_url, thumbnail_url
      FROM residence_plans
      WHERE residence_id = ${id}
    `

    // Récupérer les catégories de galerie et leurs images
    const categories = await sql`
      SELECT id, category_name
      FROM residence_gallery_categories
      WHERE residence_id = ${id}
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Vérifier si la résidence existe
    const [existingResidence] = await sql`
      SELECT id FROM residences WHERE id = ${id}
    `

    if (!existingResidence) {
      return NextResponse.json({ error: "Résidence non trouvée" }, { status: 404 })
    }

    // Mettre à jour la résidence principale
    await sql`
      UPDATE residences
      SET title = ${body.title},
          slug = ${body.slug},
          status = ${body.status},
          start_date = ${body.startDate},
          end_date = ${body.endDate},
          location = ${body.location || null},
          brochure_url = ${body.brochureUrl || null},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    // Supprimer les anciennes descriptions et en ajouter de nouvelles
    await sql`DELETE FROM residence_descriptions WHERE residence_id = ${id}`
    if (body.description && body.description.length > 0) {
      await Promise.all(
        body.description.map((paragraph: string, index: number) => {
          return sql`
          INSERT INTO residence_descriptions (residence_id, paragraph, position)
          VALUES (${id}, ${paragraph}, ${index})
        `
        }),
      )
    }

    // Supprimer les anciens types d'appartements et en ajouter de nouveaux
    await sql`DELETE FROM residence_apartment_types WHERE residence_id = ${id}`
    if (body.apartmentTypes && body.apartmentTypes.length > 0) {
      await Promise.all(
        body.apartmentTypes.map((type: string, index: number) => {
          return sql`
          INSERT INTO residence_apartment_types (residence_id, type_name, position)
          VALUES (${id}, ${type}, ${index})
        `
        }),
      )
    }

    // Supprimer les anciennes commodités et en ajouter de nouvelles
    await sql`DELETE FROM residence_amenities WHERE residence_id = ${id}`
    if (body.amenities && body.amenities.length > 0) {
      await Promise.all(
        body.amenities.map((amenity: string, index: number) => {
          return sql`
          INSERT INTO residence_amenities (residence_id, amenity_name, position)
          VALUES (${id}, ${amenity}, ${index})
        `
        }),
      )
    }

    // Supprimer les anciens plans et en ajouter de nouveaux
    await sql`DELETE FROM residence_plans WHERE residence_id = ${id}`
    if (body.plans && body.plans.length > 0) {
      await Promise.all(
        body.plans.map((plan: any) => {
          return sql`
          INSERT INTO residence_plans (residence_id, title, file_url, thumbnail_url)
          VALUES (${id}, ${plan.title}, ${plan.fileUrl}, ${plan.thumbnailUrl || null})
        `
        }),
      )
    }

    // Supprimer les anciennes catégories de galerie et leurs images
    const oldCategories = await sql`
      SELECT id FROM residence_gallery_categories WHERE residence_id = ${id}
    `

    for (const category of oldCategories) {
      await sql`DELETE FROM residence_gallery_images WHERE category_id = ${category.id}`
    }

    await sql`DELETE FROM residence_gallery_categories WHERE residence_id = ${id}`

    // Ajouter les nouvelles catégories de galerie et leurs images
    if (body.gallery) {
      const categories = Object.keys(body.gallery)

      for (const category of categories) {
        const [categoryRecord] = await sql`
          INSERT INTO residence_gallery_categories (residence_id, category_name)
          VALUES (${id}, ${category})
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

    return NextResponse.json({ id, message: "Résidence mise à jour avec succès" })
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la résidence:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la résidence" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Vérifier si la résidence existe
    const [existingResidence] = await sql`
      SELECT id FROM residences WHERE id = ${id}
    `

    if (!existingResidence) {
      return NextResponse.json({ error: "Résidence non trouvée" }, { status: 404 })
    }

    // Supprimer la résidence (les suppressions en cascade s'occuperont des tables liées)
    await sql`DELETE FROM residences WHERE id = ${id}`

    return NextResponse.json({ message: "Résidence supprimée avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression de la résidence:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression de la résidence" }, { status: 500 })
  }
}

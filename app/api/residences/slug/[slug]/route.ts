import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params
    const residence = await prisma.residences.findUnique({
      where: { slug: slug },
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

    // Convert bigints to strings for JSON serialization
    const serialized = JSON.parse(JSON.stringify(residence, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

        return NextResponse.json(serialized, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    } catch (error) {
        console.error("Erreur lors de la récupération de la résidence par slug:", error)
        return NextResponse.json({ error: "Erreur lors de la récupération de la résidence" }, {
            status: 500,
            headers: { 'Access-Control-Allow-Origin': '*' }
        });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    });
}

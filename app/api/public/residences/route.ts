import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const residences = await prisma.residences.findMany({
            where: {
                status: {
                    in: ['en_cours', 'venir', 'livr_'] // Only show non-draft
                }
            },
            include: {
                residence_amenities: true,
                residence_apartment_types: true,
                residence_descriptions: true,
                residence_gallery_images: true,
                residence_plans: true
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        // Convert bigints to strings for JSON serialization
        const serialized = JSON.parse(JSON.stringify(residences, (key, value) =>
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
        console.error("Public API Residences error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, {
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

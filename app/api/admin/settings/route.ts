import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const settings = await prisma.infosystems.findFirst();

        const updateData = {
            company_name: body.company_name,
            email: body.email,
            phone: body.phone,
            phone_secondary: body.phone_secondary,
            address: body.address,
            city: body.city,
            country: body.country,
            postal_code: body.postal_code,
            logo: body.logo,
            facebook: body.facebook,
            instagram: body.instagram,
            linkedin: body.linkedin,
            youtube: body.youtube,
            whatsapp: body.whatsapp,
            twitter: body.twitter,
            company_description: body.company_description,
            opening_hours: body.opening_hours,
        };

        if (settings) {
            await prisma.infosystems.update({
                where: { id: settings.id },
                data: updateData
            });
        } else {
            await prisma.infosystems.create({
                data: updateData
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("API Settings error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

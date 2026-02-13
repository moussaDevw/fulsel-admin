import prisma from '@/lib/prisma';
import ResidencesListClient from '@/components/residences/ResidencesListClient';

export const dynamic = "force-dynamic";

export default async function ResidencesPage() {
    const residences = await prisma.residences.findMany({
        orderBy: {
            created_at: 'desc'
        }
    });

    // Serialize BigInt to strings for Client Components
    const serializedResidences = JSON.parse(JSON.stringify(residences, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));

    return (
        <ResidencesListClient residences={serializedResidences} />
    );

}

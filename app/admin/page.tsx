import prisma from '@/lib/prisma';
import DashboardClient from '@/components/dashboard/DashboardClient';

export default async function AdminDashboardPage() {
    const totalResidences = await prisma.residences.count();
    const completedResidences = await prisma.residences.count({
        where: {
            status: 'livr_'
        }
    });
    const totalUsers = await prisma.users.count();

    return (
        <DashboardClient 
            stats={{
                totalResidences,
                completedResidences,
                totalUsers
            }} 
        />
    );
}

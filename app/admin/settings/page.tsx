import prisma from '@/lib/prisma';
import SettingsClient from '@/components/settings/SettingsClient';

export default async function SettingsPage() {
    const settings = await prisma.infosystems.findFirst();

    return (
        <SettingsClient settings={settings} />
    );
}

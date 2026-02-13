"use client"

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authStorage } from '@/lib/auth-storage';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const isAuthenticated = authStorage.isAuthenticated();

            // If not authenticated and trying to access admin routes
            if (!isAuthenticated && pathname?.startsWith('/admin')) {
                router.push('/auth/login');
                return;
            }

            // If authenticated and trying to access login page
            if (isAuthenticated && pathname === '/auth/login') {
                router.push('/admin');
                return;
            }

            setIsChecking(false);
        };

        checkAuth();
    }, [pathname, router]);

    // Show loading state while checking authentication
    if (isChecking) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-fulser-gold" />
            </div>
        );
    }

    return <>{children}</>;
}

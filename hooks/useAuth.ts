"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authStorage, UserData } from '@/lib/auth-storage';

export function useAuth() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check authentication status on mount
        const checkAuth = () => {
            const token = authStorage.getToken();
            const userData = authStorage.getUser();

            if (token && userData) {
                setUser(userData);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = (token: string, userData: UserData) => {
        authStorage.setToken(token);
        authStorage.setUser(userData);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        authStorage.clearAuth();
        setUser(null);
        setIsAuthenticated(false);
        router.push('/auth/login');
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
    };
}

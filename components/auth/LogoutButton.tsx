
"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setLoading(true);

            // Clear localStorage
            localStorage.removeItem('fulser_auth_token');
            localStorage.removeItem('fulser_user_data');

            // Redirect to login
            router.push("/auth/login");
        } catch (error) {
            console.error("Erreur déconnexion:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            disabled={loading}
            className="text-gray-500 hover:text-red-500 transition-colors"
            title="Se déconnecter"
        >
            <LogOut size={20} />
        </Button>
    );
}

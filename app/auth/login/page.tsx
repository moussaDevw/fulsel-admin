"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                // Redirection vers le dashboard admin
                router.refresh(); // Refresh to update middleware state
                router.push("/admin");
            } else {
                const data = await response.json();
                setError(data.error || "Email ou mot de passe incorrect");
            }
        } catch (err) {
            setError("Une erreur est survenue lors de la connexion")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-fulser-blue px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-sm border-none shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center items-center space-x-2 font-bold text-2xl tracking-wide mb-2">
                        <span className="text-fulser-gold">FULSER</span>
                        <span className="text-fulser-blue">ADMIN</span>
                    </div>
                    <CardDescription>
                        Entrez vos identifiants pour accéder au panneau d'administration
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="flex items-center space-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <span>{error}</span>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-fulser-blue/80">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@fulsel.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="border-gray-200 focus-visible:ring-fulser-gold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-fulser-blue/80">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="border-gray-200 focus-visible:ring-fulser-gold"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-fulser-gold hover:bg-fulser-gold/90 text-white transition-all duration-200 shadow-lg"
                            type="submit"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Se connecter
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

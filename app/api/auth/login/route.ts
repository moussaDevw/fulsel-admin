
import { NextResponse } from "next/server";
import { encrypt } from "@/lib/session";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email et mot de passe requis" },
                { status: 400 }
            );
        }

        // 1. Check if user exists
        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Utilisateur non trouvé" },
                { status: 401 }
            );
        }

        // 2. Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            // Optional: Fallback for plaintext passwords during migration/seeding
            if (password === user.password) {
                // If valid as plaintext, hash it now for future
                const hashedPassword = await bcrypt.hash(password, 10);
                await prisma.users.update({
                    where: { id: user.id },
                    data: { password: hashedPassword }
                });
            } else {
                return NextResponse.json(
                    { error: "Mot de passe incorrect" },
                    { status: 401 }
                );
            }
        }

        // 3. Create JWT token
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        const token = await encrypt({
            userId: user.id.toString(),
            email: user.email,
            role: "admin", // Assuming admin for now, or fetch role from user
            expiresAt: expires,
        });

        // 4. Return token and user data to be stored client-side
        return NextResponse.json({
            success: true,
            token,
            user: {
                id: user.id.toString(),
                email: user.email,
                name: user.name,
                role: "admin"
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json(
            { error: "Erreur serveur lors de la connexion" },
            { status: 500 }
        );
    }
}

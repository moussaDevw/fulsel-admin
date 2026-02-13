
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET || "default-secret-key";
const key = new TextEncoder().encode(secretKey);

export type SessionPayload = {
    userId: string;
    email: string;
    role: string | null;
    expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d") // 7 days session
        .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
}

export async function login(userId: string, email: string) {
    // Create the session
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const session = await encrypt({ userId, email, role: "admin", expiresAt: expires });

    // Save the session in a cookie
    cookies().set("session", session, { httpOnly: true, secure: true, expires, sameSite: "lax", path: "/" });
}

export async function logout() {
    // Destroy the session
    cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
    const session = cookies().get("session")?.value;
    if (!session) return null;
    try {
        return await decrypt(session);
    } catch (error) {
        return null;
    }
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    parsed.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: "session",
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expiresAt,
    });
    return res;
}

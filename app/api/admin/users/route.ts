import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const users = await prisma.users.findMany({
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        created_at: true,
        avatar: true
      }
    })
    
    // Convert BigInt to string for JSON serialization
    const serializedUsers = JSON.parse(JSON.stringify(users, (_, v) => typeof v === 'bigint' ? v.toString() : v))
    
    return NextResponse.json(serializedUsers)
  } catch (error) {
    console.error("Users GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const user = await prisma.users.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password || "password123", // Basic default for now
        phone: body.phone,
        status: body.status || "active",
      }
    })
    return NextResponse.json({ success: true, user: JSON.parse(JSON.stringify(user, (_, v) => typeof v === 'bigint' ? v.toString() : v)) })
  } catch (error) {
    console.error("Users POST Error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

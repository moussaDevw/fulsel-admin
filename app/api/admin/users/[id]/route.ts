import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.users.findUnique({
      where: { id: BigInt(params.id) },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        bio: true,
        avatar: true,
        status: true,
        created_at: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const serializedUser = JSON.parse(JSON.stringify(user, (_, v) => typeof v === 'bigint' ? v.toString() : v))
    return NextResponse.json(serializedUser)
  } catch (error) {
    console.error("User GET ID Error:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const user = await prisma.users.update({
      where: { id: BigInt(params.id) },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        bio: body.bio,
        avatar: body.avatar,
        status: body.status,
        // Update password only if provided
        ...(body.password ? { password: body.password } : {})
      }
    })

    const serializedUser = JSON.parse(JSON.stringify(user, (_, v) => typeof v === 'bigint' ? v.toString() : v))
    return NextResponse.json({ success: true, user: serializedUser })
  } catch (error) {
    console.error("User PUT ID Error:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.users.delete({
      where: { id: BigInt(params.id) }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("User DELETE ID Error:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}

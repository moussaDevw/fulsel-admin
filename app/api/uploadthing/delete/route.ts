import { type NextRequest, NextResponse } from "next/server"
import { UTApi } from "uploadthing/server"

const utapi = new UTApi()

export async function POST(request: NextRequest) {
  try {
    const { fileKeys } = await request.json()

    if (!fileKeys || !Array.isArray(fileKeys) || fileKeys.length === 0) {
      return NextResponse.json({ error: "No file keys provided" }, { status: 400 })
    }

    console.log("Deleting files from UploadThing:", fileKeys)
    await utapi.deleteFiles(fileKeys)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting files from UploadThing:", error)
    return NextResponse.json({ error: "Failed to delete files" }, { status: 500 })
  }
}

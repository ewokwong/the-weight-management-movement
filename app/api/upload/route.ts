import { put } from "@vercel/blob"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = formData.get("folder") as string || "blog"

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Generate a unique filename
    const timestamp = Date.now()
    const filename = `${folder}/${timestamp}-${file.name}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    })

    return NextResponse.json({
      url: blob.url,
      filename: filename,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}


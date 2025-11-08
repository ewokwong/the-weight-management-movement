import { NextResponse } from "next/server"
import { getDatabase, collections } from "@/lib/db"
import { mockBlogs } from "@/lib/blog-data"

export async function GET() {
  try {
    const db = await getDatabase()
    
    // Initialize all blogs from blog-data.ts
    const results = []
    
    for (const blog of mockBlogs) {
      const existing = await db.collection(collections.blogs).findOne({ slug: blog.slug })
      
      if (!existing) {
        await db.collection(collections.blogs).insertOne({
          slug: blog.slug,
          views: 0,
          likes: 0,
          comments: [],
          viewed_by: [],
          liked_by: [],
          updated_at: new Date(),
        })
        results.push({ slug: blog.slug, status: "created" })
      } else {
        results.push({ slug: blog.slug, status: "already exists" })
      }
    }
    
    return NextResponse.json({
      message: "Blogs initialized",
      results,
    })
  } catch (error: any) {
    console.error("Error initializing blogs:", error)
    return NextResponse.json(
      { error: "Failed to initialize blogs", details: error.message },
      { status: 500 }
    )
  }
}

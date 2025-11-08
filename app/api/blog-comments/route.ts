import { NextRequest, NextResponse } from "next/server"
import { getDatabase, collections } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 })
  }

  try {
    const db = await getDatabase()
    
    // Get blog entry
    const blog = await db.collection(collections.blogs).findOne({ slug })
    
    if (!blog || !blog.comments) {
      return NextResponse.json({ comments: [] })
    }

    // Organize comments into a tree structure
    const comments = blog.comments || []
    const commentMap = new Map()
    const rootComments: any[] = []

    // First pass: create all comment objects
    comments.forEach((comment: any) => {
      const commentId = comment._id?.toString() || comment.id?.toString()
      commentMap.set(commentId, {
        id: commentId,
        author: comment.author,
        content: comment.content,
        parentId: comment.parent_id ? (comment.parent_id.toString?.() || comment.parent_id) : null,
        createdAt: comment.created_at,
        replies: [],
      })
    })

    // Second pass: organize into tree
    comments.forEach((comment: any) => {
      const commentId = comment._id?.toString() || comment.id?.toString()
      const commentObj = commentMap.get(commentId)
      if (comment.parent_id) {
        // This is a reply
        const parentId = comment.parent_id.toString?.() || comment.parent_id
        const parent = commentMap.get(parentId)
        if (parent) {
          parent.replies.push(commentObj)
        }
      } else {
        // This is a top-level comment
        rootComments.push(commentObj)
      }
    })

    return NextResponse.json({ comments: rootComments })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, author, content, parentId } = body

    if (!slug || !author || !content) {
      return NextResponse.json(
        { error: "Slug, author, and content are required" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    
    // Create comment object
    const commentData: any = {
      _id: new ObjectId(),
      author,
      content,
      created_at: new Date(),
    }

    if (parentId) {
      commentData.parent_id = new ObjectId(parentId)
    }

    // Add comment to blog's comments array
    await db.collection(collections.blogs).updateOne(
      { slug },
      {
        $push: { comments: commentData },
        $setOnInsert: {
          views: 0,
          likes: 0,
          viewed_by: [],
          liked_by: [],
          updated_at: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({
      comment: {
        id: commentData._id.toString(),
        author,
        content,
        parentId: parentId || null,
        createdAt: commentData.created_at,
      },
    })
  } catch (error) {
    console.error("Error posting comment:", error)
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 }
    )
  }
}

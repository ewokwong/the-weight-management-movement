"use client"

import { useState } from "react"
import { Heart, MessageCircle, Eye } from "lucide-react"

interface Blog {
  id: number
  title: string
  excerpt: string
  image: string
  date: string
  views: number
  likes: number
  comments: number
}

interface BlogCardProps {
  blog: Blog
}

export default function BlogCard({ blog }: BlogCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <article className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow">
      <div className="relative overflow-hidden h-48 bg-muted">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">📸</div>
              <p className="text-xs text-muted-foreground">Image unavailable</p>
            </div>
          </div>
        ) : (
          <img
            src={blog.image || "/placeholder.svg"}
            alt={blog.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>

      <div className="p-6">
        <p className="text-sm text-muted-foreground mb-3">{blog.date}</p>

        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">{blog.title}</h3>

        <p className="text-muted-foreground mb-6 line-clamp-2">{blog.excerpt}</p>

        <div className="flex gap-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span>{blog.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="w-4 h-4" />
            <span>{blog.likes.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircle className="w-4 h-4" />
            <span>{blog.comments.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

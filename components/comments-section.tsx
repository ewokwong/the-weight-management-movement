"use client"

import { useState } from "react"
import { MessageCircle, Send, User } from "lucide-react"

interface Comment {
  id: number
  author: string
  content: string
  date: string
  avatar?: string
}

interface CommentsSectionProps {
  blogSlug: string
  initialComments?: Comment[]
}

export default function CommentsSection({ blogSlug, initialComments = [] }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sample comments if none provided
  const defaultComments: Comment[] = [
    {
      id: 1,
      author: "Alex Johnson",
      content: "This article really opened my eyes to the importance of sleep in weight management. I've been struggling with late-night cravings, and now I understand why!",
      date: "2 days ago",
    },
    {
      id: 2,
      author: "Maria Garcia",
      content: "Great read! The science-backed approach is exactly what I needed. Looking forward to implementing these strategies.",
      date: "5 days ago",
    },
    {
      id: 3,
      author: "David Chen",
      content: "The section on metabolism was particularly insightful. It's refreshing to see evidence-based content instead of fad diets.",
      date: "1 week ago",
    },
  ]

  const displayComments = comments.length > 0 ? comments : defaultComments

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !authorName.trim() || isSubmitting) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const comment: Comment = {
      id: Date.now(),
      author: authorName,
      content: newComment,
      date: "Just now",
    }

    setComments([comment, ...displayComments])
    setNewComment("")
    setAuthorName("")
    setIsSubmitting(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-16 border-t border-border">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-6 h-6 text-muted-foreground" />
          <h2 className="text-3xl font-bold">Comments</h2>
        </div>
        <p className="text-muted-foreground">{displayComments.length} comment{displayComments.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-12 p-6 bg-card border border-border rounded-lg">
        <div className="mb-4">
          <label htmlFor="author" className="block text-sm font-medium mb-2">
            Name
          </label>
          <input
            id="author"
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium mb-2">
            Comment
          </label>
          <textarea
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim() || !authorName.trim()}
          className="flex items-center gap-2 px-6 py-2 bg-foreground text-background font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {displayComments.map((comment) => (
          <div key={comment.id} className="flex gap-4 pb-6 border-b border-border last:border-0">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold">{comment.author}</span>
                <span className="text-sm text-muted-foreground">{comment.date}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


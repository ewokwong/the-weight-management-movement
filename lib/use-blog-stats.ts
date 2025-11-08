"use client"

import { useState, useEffect, useCallback } from "react"

interface BlogStats {
  views: number
  likes: number
  comments: number
}

export function useBlogStats(slug: string, initialStats: BlogStats) {
  const [stats, setStats] = useState<BlogStats>(initialStats)
  const [hasLiked, setHasLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load stats from API
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch(`/api/blog-stats?slug=${slug}`)
        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
          setHasLiked(data.hasLiked)
          
          // Track view if not already viewed
          if (!data.hasViewed) {
            await fetch("/api/blog-stats", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ slug, action: "view" }),
            })
            // Reload stats after view
            const updatedResponse = await fetch(`/api/blog-stats?slug=${slug}`)
            if (updatedResponse.ok) {
              const updatedData = await updatedResponse.json()
              setStats(updatedData.stats)
            }
          }
        }
      } catch (error) {
        console.error("Failed to load stats:", error)
        // Fallback to initial stats if API fails
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [slug])

  const incrementLikes = async () => {
    if (hasLiked) return

    try {
      const response = await fetch("/api/blog-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, action: "like" }),
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setHasLiked(true)
      }
    } catch (error) {
      console.error("Failed to like:", error)
    }
  }

  const updateComments = useCallback(async (count: number) => {
    // Comments count is updated automatically when comments are posted
    // This is just for local state sync
    setStats((prev) => ({ ...prev, comments: count }))
  }, [])

  return {
    stats,
    incrementLikes,
    updateComments,
    isLoading,
    hasLiked,
  }
}

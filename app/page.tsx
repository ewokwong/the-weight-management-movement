"use client"

import { useState } from "react"
import Hero from "@/components/hero"
import BlogCard from "@/components/blog-card"
import EmailModal from "@/components/email-modal"

const mockBlogs = [
  {
    id: 1,
    title: "The Science Behind Sustainable Weight Loss",
    excerpt: "Discover evidence-based strategies that actually work for long-term weight management.",
    image: "/healthy-lifestyle-nutrition.jpg",
    date: "Nov 15, 2025",
    views: 2843,
    likes: 456,
    comments: 89,
  },
  {
    id: 2,
    title: "Nutrition Myths Debunked",
    excerpt: "We break down the most common misconceptions about diet and nutrition.",
    image: "/healthy-food-diet.jpg",
    date: "Nov 10, 2025",
    views: 1924,
    likes: 342,
    comments: 67,
  },
  {
    id: 3,
    title: "Building a Sustainable Exercise Routine",
    excerpt: "Learn how to create a workout plan that fits your lifestyle and goals.",
    image: "/fitness-exercise-workout.jpg",
    date: "Nov 5, 2025",
    views: 3156,
    likes: 578,
    comments: 124,
  },
  {
    id: 4,
    title: "The Role of Sleep in Weight Management",
    excerpt: "Understand how quality sleep impacts your metabolism and food choices.",
    image: "/sleep-rest-wellness.jpg",
    date: "Oct 28, 2025",
    views: 2341,
    likes: 421,
    comments: 93,
  },
]

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <main className="bg-background text-foreground">
      <Hero onCTA={() => setModalOpen(true)} />

      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Latest Articles</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our collection of expert insights and actionable strategies for your weight management journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      </section>

      <EmailModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  )
}

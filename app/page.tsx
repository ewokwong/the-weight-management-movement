"use client"

import { useState } from "react"
import Hero from "@/components/hero"
import BlogCard from "@/components/blog-card"
import EmailModal from "@/components/email-modal"
import { mockBlogs } from "@/lib/blog-data"

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

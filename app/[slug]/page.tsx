import Link from "next/link"
import { getBlogBySlug, getAllBlogSlugs } from "@/lib/blog-data"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import SmoothScrollLink from "@/components/smooth-scroll-link"
import CommentsSection from "@/components/comments-section"
import MarkdownRenderer from "@/components/markdown-renderer"
import BlogStatsDisplay from "@/components/blog-stats-display"
import EmailSubscription from "@/components/email-subscription"

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = getBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  return (
    <main className="bg-background text-foreground">
      {/* Back Button */}
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 md:px-8 pt-16 pb-8">
        {/* Header */}
        <header className="mb-12">
          <div className="mb-6">
            <p className="text-muted-foreground text-sm">{blog.date}</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">{blog.title}</h1>
          <p className="text-lg text-muted-foreground">{blog.excerpt}</p>
        </header>

        {/* Engagement Stats */}
        <BlogStatsDisplay 
          slug={blog.slug}
          initialViews={blog.views}
          initialLikes={blog.likes}
          initialComments={blog.comments}
        />

        {/* Content and Email Subscription Side by Side */}
        <div className="flex flex-col lg:flex-row gap-8 mt-8 items-start">
          {/* Blog Content */}
          <div className="flex-1 [&>*:last-child]:mb-0">
            <MarkdownRenderer content={blog.content} />
          </div>
          
          {/* Email Subscription - 50% width, Sticky on larger screens */}
          <div className="w-full lg:w-[50%] lg:sticky lg:top-8">
            <EmailSubscription />
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <CommentsSection blogSlug={slug} initialCommentsCount={blog.comments} />

      {/* Related Articles Footer */}
      <div className="border-t border-border py-12 mt-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <p className="text-muted-foreground mb-6">Want to explore more articles?</p>
          <SmoothScrollLink
            href="/"
            scrollTarget="articles"
            className="inline-block px-6 py-3 bg-foreground text-background font-bold rounded hover:opacity-90 transition-opacity"
          >
            View All Articles
          </SmoothScrollLink>
        </div>
      </div>
    </main>
  )
}

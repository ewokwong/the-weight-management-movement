"use client"

import { useEffect, useState } from "react"

interface HeroProps {
  onCTA: () => void
}

export default function Hero({ onCTA }: HeroProps) {
  const [scrollOpacity, setScrollOpacity] = useState(1)

  useEffect(() => {
    const handleScroll = () => {
      // Calculate opacity based on scroll position (fade out in first 500px of scroll)
      const scrolled = window.scrollY
      const opacity = Math.max(0, 1 - scrolled / 500)
      setScrollOpacity(opacity)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section
      className="relative min-h-screen bg-primary text-primary-foreground flex items-center justify-center py-20 px-4 overflow-hidden"
      style={{ opacity: scrollOpacity, transition: "opacity 0.1s ease-out" }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-7xl font-black">↗</div>
        <div className="absolute bottom-20 right-10 text-7xl font-black">↙</div>
        <div className="absolute top-1/3 right-20 text-6xl font-black">×</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl font-black">•</div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-6xl md:text-8xl font-black mb-6 text-balance leading-tight tracking-tight">
          THE WEIGHT
          <br />
          MANAGEMENT
          <br />
          MOVEMENT
        </h1>

        <div className="h-1 w-32 bg-secondary mx-auto mb-12"></div>

        <p className="text-lg md:text-xl text-primary-foreground/75 mb-12 max-w-2xl mx-auto text-balance font-medium tracking-wide uppercase letter-spacing-wide">
          Science-Backed Strategies for Sustainable Change
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onCTA}
            className="px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-black text-lg hover:bg-secondary/90 transition-all hover:scale-105 active:scale-95 uppercase tracking-wider"
          >
            Join the Movement
          </button>
          <button className="px-8 py-4 border-2 border-primary-foreground text-primary-foreground rounded-full font-black text-lg hover:bg-primary-foreground/10 transition-all uppercase tracking-wider">
            Read Articles
          </button>
        </div>
      </div>
    </section>
  )
}

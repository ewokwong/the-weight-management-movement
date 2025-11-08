"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface SmoothScrollLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  scrollTarget?: string
}

export default function SmoothScrollLink({ href, children, className, scrollTarget }: SmoothScrollLinkProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [shouldScroll, setShouldScroll] = useState(false)

  useEffect(() => {
    // Handle scroll after navigation completes
    if (shouldScroll && scrollTarget) {
      const scrollToElement = () => {
        const element = document.getElementById(scrollTarget || "")
        if (element) {
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
          const offsetPosition = elementPosition - 80 // Account for any fixed headers
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          })
          setShouldScroll(false)
        } else {
          // Retry if element not found yet
          setTimeout(scrollToElement, 100)
        }
      }
      
      // Wait a bit for page to render
      const timer = setTimeout(scrollToElement, 150)
      return () => clearTimeout(timer)
    }
  }, [shouldScroll, scrollTarget])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    if (pathname === href) {
      // Already on the page, just scroll
      const element = document.getElementById(scrollTarget || "")
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - 80
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        })
      }
    } else {
      // Navigate and set flag to scroll after navigation
      setShouldScroll(true)
      router.push(href)
    }
  }

  return (
    <a href={`${href}${scrollTarget ? `#${scrollTarget}` : ""}`} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}


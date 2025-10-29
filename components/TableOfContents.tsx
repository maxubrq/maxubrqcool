'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronUp, ChevronDown, List } from 'lucide-react'

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  className?: string
}

export function TableOfContents({ className = '' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeHeading, setActiveHeading] = useState<string>('')
  const [isVisible, setIsVisible] = useState(true)
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false)

  useEffect(() => {
    // Extract headings from the page
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const extractedHeadings: Heading[] = []

    headingElements.forEach((element, index) => {
      const id = element.id || `heading-${index}`
      const text = element.textContent || ''
      const level = parseInt(element.tagName.charAt(1))

      // Set id if it doesn't exist
      if (!element.id) {
        element.id = id
      }

      extractedHeadings.push({ id, text, level })
    })

    setHeadings(extractedHeadings)

    // Set up intersection observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0
      }
    )

    headingElements.forEach((element) => {
      observer.observe(element)
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  const toggleMobileToc = () => {
    setIsMobileTocOpen(!isMobileTocOpen)
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <>
      {/* Desktop Sidebar TOC — Swiss editorial: flat, rule-based, no card */}
      <div className={`hidden lg:block w-full ${className}`}>
        <nav className="border-l border-border/30 pl-4 space-y-1">
          {headings.map((heading) => {
            const isActive = activeHeading === heading.id
            return (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={
                  `block w-full text-left py-1.5 transition-colors ` +
                  `text-sm font-normal ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`
                }
                style={{
                  paddingLeft: `${(heading.level - 1) * 12}px`
                }}
              >
                <span className={`block whitespace-normal break-words border-l-2 pl-3 ${isActive ? 'border-primary font-medium' : 'border-transparent'}`}>
                  {heading.text}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Mobile TOC — minimal collapsible, flat */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          onClick={toggleMobileToc}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Table of Contents
          </span>
          {isMobileTocOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        {isMobileTocOpen && (
          <nav className="mt-2 border-l border-border/30 pl-4 space-y-1 max-h-60 overflow-y-auto">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => {
                  scrollToHeading(heading.id)
                  setIsMobileTocOpen(false)
                }}
                className={`block w-full text-left py-1.5 text-sm transition-colors ${
                  activeHeading === heading.id
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
              >
                <span className={`block whitespace-normal break-words border-l-2 pl-3 ${activeHeading === heading.id ? 'border-primary font-medium' : 'border-transparent'}`}>
                  {heading.text}
                </span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </>
  )
}

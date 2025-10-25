'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
      {/* Desktop Sidebar TOC */}
      <div className={`hidden lg:block w-80 flex-shrink-0 ${className}`}>
        <div className="sticky top-4">
          <Card className="shadow-lg border">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <List className="h-4 w-4" />
                Table of Contents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <nav className="space-y-1">
                {headings.map((heading) => (
                  <button
                    key={heading.id}
                    onClick={() => scrollToHeading(heading.id)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-200 hover:bg-muted/50 ${
                      activeHeading === heading.id
                        ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    }`}
                    style={{
                      paddingLeft: `${(heading.level - 1) * 16 + 12}px`
                    }}
                  >
                    <span className="truncate block">{heading.text}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile TOC */}
      <div className="lg:hidden mb-6">
        <Card className="w-full">
          <CardHeader className="pb-3">
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
          </CardHeader>
          {isMobileTocOpen && (
            <CardContent className="pt-0">
              <nav className="space-y-1 max-h-60 overflow-y-auto">
                {headings.map((heading) => (
                  <button
                    key={heading.id}
                    onClick={() => {
                      scrollToHeading(heading.id)
                      setIsMobileTocOpen(false)
                    }}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-200 hover:bg-muted/50 ${
                      activeHeading === heading.id
                        ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    }`}
                    style={{
                      paddingLeft: `${(heading.level - 1) * 16 + 12}px`
                    }}
                  >
                    <span className="truncate block">{heading.text}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          )}
        </Card>
      </div>
    </>
  )
}

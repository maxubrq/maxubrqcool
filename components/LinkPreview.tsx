'use client'

import { useState, useCallback } from 'react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'

interface LinkPreviewData {
  title?: string
  description?: string
  image?: string
  siteName?: string
  url: string
}

interface LinkPreviewProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function LinkPreview({ href, children, className }: LinkPreviewProps) {
  const [previewData, setPreviewData] = useState<LinkPreviewData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Check if this is an external link
  const isExternal = href?.startsWith('http://') || href?.startsWith('https://')

  const fetchPreview = useCallback(async () => {
    if (!isExternal || previewData || isLoading || hasError) {
      return
    }

    setIsLoading(true)
    setHasError(false)

    try {
      const response = await fetch(`/api/link-preview?url=${encodeURIComponent(href)}`)
      
      if (response.ok) {
        const data = await response.json()
        setPreviewData(data)
      } else {
        setHasError(true)
      }
    } catch (error) {
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }, [href, isExternal, previewData, isLoading, hasError])

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open)
    if (open && !previewData && !isLoading && !hasError) {
      // Fetch preview when hover card opens
      fetchPreview()
    }
  }, [previewData, isLoading, hasError, fetchPreview])

  // For internal links, render as normal link
  if (!isExternal) {
    return (
      <a
        href={href}
        className={cn(
          'text-blue-600 hover:text-blue-800 underline transition-colors',
          className
        )}
      >
        {children}
      </a>
    )
  }

  // For external links, always use HoverCard but only show content if we have preview data
  return (
    <HoverCard open={isOpen} onOpenChange={handleOpenChange} openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'text-blue-600 hover:text-blue-800 underline transition-colors inline-flex items-center gap-1',
            className
          )}
        >
          {children}
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>
      </HoverCardTrigger>
      {/* Only render content if we have preview data */}
      {previewData && (previewData.title || previewData.description) && (
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            {previewData.image && (
              <div className="relative w-full h-40 overflow-hidden rounded-sm bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewData.image}
                  alt={previewData.title || 'Preview'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
            <div className="space-y-1">
              {previewData.title && (
                <h4 className="text-sm font-semibold leading-tight">
                  {previewData.title}
                </h4>
              )}
              {previewData.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {previewData.description}
                </p>
              )}
              <div className="flex items-center gap-2 pt-1">
                {previewData.siteName && (
                  <span className="text-xs text-muted-foreground">
                    {previewData.siteName}
                  </span>
                )}
                <span className="text-xs text-muted-foreground truncate">
                  {new URL(previewData.url).hostname}
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  )
}


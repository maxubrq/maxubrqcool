"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import mermaid from 'mermaid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Download, RefreshCw, ZoomIn, ZoomOut, RotateCcw, Maximize2, X } from 'lucide-react'
import { getElegantBrutalismTheme } from '@/lib/mermaid-theme'

interface MermaidProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export function Mermaid({ children, title, className = "" }: MermaidProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [svgContent, setSvgContent] = useState<string>('')
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 })
  const diagramRef = useRef<HTMLDivElement>(null)
  const lightboxRef = useRef<HTMLDivElement>(null)
  const mermaidId = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
  
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: getElegantBrutalismTheme(isDarkMode),
      logLevel: 'fatal',
      flowchart: {
        htmlLabels: true,
        curve: 'linear',            // brutalist: straight lines
        nodeSpacing: 60,            // Increased for longer text
        rankSpacing: 60,            // Increased for longer text
        diagramPadding: 16,        // Increased padding to prevent clipping
        padding: 16,                // Additional padding
      },
      sequence: {
        diagramMarginX: 48,
        diagramMarginY: 8,
        actorMargin: 48,
        width: 160,
        height: 60,
        boxMargin: 10,
        boxTextMargin: 6,
        noteMargin: 10,
        messageMargin: 30,
        mirrorActors: true,
        bottomMarginAdj: 1,
        useMaxWidth: true,
        rightAngles: true,          // brutalist: right angles
        showSequenceNumbers: false,
      },
      gantt: {
        titleTopMargin: 24,
        barHeight: 18,
        fontSize: 12,
        gridLineStartPadding: 32,
        leftPadding: 72,
        rightPadding: 16,
        numberSectionStyles: 4,
      },
      er: { useMaxWidth: true },
      class: { useMaxWidth: true },
      pie: { useMaxWidth: true },
      mindmap: { padding: 12 },
      journey: { useMaxWidth: true },
    })
  }, [])

  // Extract text content from children
  const getTextContent = useCallback((children: React.ReactNode): string => {
    if (typeof children === 'string') {
      return children.trim()
    }
    if (Array.isArray(children)) {
      return children.map(getTextContent).join('')
    }
    if (children && typeof children === 'object' && 'props' in children) {
      return getTextContent((children as any).props.children)
    }
    return ''
  }, [])

  // Render the diagram
  const renderDiagram = useCallback(async () => {
    const diagramCode = getTextContent(children)
    if (!diagramRef.current || !diagramCode) return

    try {
      setIsLoading(true)
      setError(null)

      // Clear previous content
      diagramRef.current.innerHTML = ''

      // Create a unique ID for this diagram
      const id = mermaidId.current
      const element = document.createElement('div')
      element.id = id
      element.textContent = diagramCode
      diagramRef.current.appendChild(element)

      // Render the diagram
      const { svg } = await mermaid.render(`${id}-svg`, diagramCode)
      
      // Clear the text content and add the SVG
      element.innerHTML = svg
      setSvgContent(svg)
      setIsLoading(false)
    } catch (err) {
      console.error('Mermaid rendering error:', err)
      setError(err instanceof Error ? err.message : 'Failed to render diagram')
      setIsLoading(false)
    }
  }, [children, getTextContent])

  // Re-render when content changes
  useEffect(() => {
    renderDiagram()
  }, [children, renderDiagram])

  // Listen for theme changes and re-render
  useEffect(() => {
    const observer = new MutationObserver(() => {
      renderDiagram()
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [renderDiagram])

  // Prevent text selection during panning
  useEffect(() => {
    if (isPanning) {
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'grabbing'
    } else {
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }

    return () => {
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isPanning])

  // Copy diagram code to clipboard
  const copyCode = async () => {
    try {
      const diagramCode = getTextContent(children)
      await navigator.clipboard.writeText(diagramCode)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Download diagram as SVG
  const downloadSvg = () => {
    if (!svgContent) return

    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${title || 'mermaid-diagram'}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Zoom functions
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 5))
  }

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.1))
  }

  const resetZoom = () => {
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
  }

  // Pan functions
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsPanning(true)
      setLastPanPoint({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x
      const deltaY = e.clientY - lastPanPoint.y
      
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }))
      
      setLastPanPoint({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoomLevel(prev => Math.max(0.1, Math.min(5, prev * delta)))
  }

  // Lightbox functions
  const openLightbox = () => {
    setIsLightboxOpen(true)
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
  }

  // Handle escape key to close lightbox
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLightboxOpen) {
        closeLightbox()
      }
    }

    if (isLightboxOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isLightboxOpen])

  return (
    <Card className={`my-8 mermaid-elegant-brutal ${className}`}>
      {title && (
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Diagram
              </Badge>
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={openLightbox}
                className="h-8 w-8 p-0"
                title="Open in lightbox"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyCode}
                className="h-8 w-8 p-0"
                title="Copy diagram code"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadSvg}
                disabled={!svgContent}
                className="h-8 w-8 p-0"
                title="Download as SVG"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={renderDiagram}
                className="h-8 w-8 p-0"
                title="Refresh diagram"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className="pt-0">
        <div className="relative">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Rendering diagram...
              </div>
            </div>
          )}
          
          {error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
              <div className="flex items-center gap-2 text-destructive">
                <span className="font-medium">Diagram Error:</span>
                <span className="text-sm">{error}</span>
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Show diagram code
                </summary>
                <pre className="mt-2 overflow-x-auto rounded bg-muted p-2 text-xs">
                  <code>{getTextContent(children)}</code>
                </pre>
              </details>
            </div>
          )}
          
          <div 
            ref={diagramRef} 
            className="mermaid-container cursor-pointer"
            onClick={openLightbox}
            title="Click to open in lightbox"
          />
        </div>
      </CardContent>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm mermaid-lightbox"
          onClick={closeLightbox}
        >
          <div 
            ref={lightboxRef}
            className="relative bg-background w-full h-full overflow-hidden mermaid-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between p-4 mermaid-lightbox-header">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Diagram
                </Badge>
                <span className="font-semibold">{title || 'Mermaid Diagram'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 zoom-controls p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={zoomOut}
                    className="h-6 w-6 p-0"
                    title="Zoom out"
                  >
                    <ZoomOut className="h-3 w-3" />
                  </Button>
                  <span className="text-xs font-mono px-2 min-w-[3rem] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={zoomIn}
                    className="h-6 w-6 p-0"
                    title="Zoom in"
                  >
                    <ZoomIn className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetZoom}
                    className="h-6 w-6 p-0"
                    title="Reset zoom"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>
                
                {/* Action Buttons */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyCode}
                  className="h-8 w-8 p-0"
                  title="Copy diagram code"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadSvg}
                  disabled={!svgContent}
                  className="h-8 w-8 p-0"
                  title="Download as SVG"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closeLightbox}
                  className="h-8 w-8 p-0"
                  title="Close lightbox"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Lightbox Content */}
            <div className="relative overflow-hidden flex-1">
              <div 
                className="mermaid-container overflow-hidden cursor-grab active:cursor-grabbing"
                style={{
                  transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
                  transformOrigin: 'top left',
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

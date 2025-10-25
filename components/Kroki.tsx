"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Download, RefreshCw, ZoomIn, ZoomOut, RotateCcw, Maximize2, X } from 'lucide-react'
import * as pako from 'pako'

interface KrokiProps {
  children: React.ReactNode
  type: 'plantuml' | 'graphviz' | 'mermaid' | 'blockdiag' | 'bpmn' | 'excalidraw' | 'nomnoml' | 'pikchr' | 'vega' | 'vegalite' | 'wavedrom'
  title?: string
  className?: string
}

/** ---- Encoding helpers (UTF-8 → raw DEFLATE → base64url) ---- */
function toBase64Url(u8: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < u8.length; i++) binary += String.fromCharCode(u8[i])
  const b64 = btoa(binary)
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function deflateToBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text)      // UTF-8
  const deflated: Uint8Array = pako.deflate(bytes)  // raw DEFLATE (not gzip)
  return toBase64Url(deflated)                      // base64url (no padding)
}

/** ---- Network helpers: POST first, GET fallback ---- */
function getAbortSignal(ms: number): AbortSignal | undefined {
  // AbortSignal.timeout is widely available; guard for older runtimes.
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(ms)
  }
  const ctrl = new AbortController()
  setTimeout(() => ctrl.abort(), ms)
  return ctrl.signal
}

async function fetchSvgViaPost(type: string, code: string): Promise<Response> {
  return fetch(`https://kroki.io/${type}/svg`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=UTF-8', 'Accept': 'image/svg+xml' },
    body: code,
    signal: getAbortSignal(12000),
  })
}

async function fetchSvgViaGet(type: string, code: string): Promise<Response> {
  const encoded = deflateToBase64Url(code)
  const url = `https://kroki.io/${type}/svg/${encoded}`
  return fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'image/svg+xml' },
    signal: getAbortSignal(12000),
  })
}

export function Kroki({ children, type, title, className = "" }: KrokiProps) {
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
  const mermaidId = useRef(`kroki-${Math.random().toString(36).substr(2, 9)}`)

  // Extract text content from children (handles strings / arrays / elements)
  const getTextContent = useCallback((node: React.ReactNode): string => {
    if (node == null || node === false) return ''
    if (typeof node === 'string' || typeof node === 'number') return String(node).trim()
    if (Array.isArray(node)) return node.map(getTextContent).join('')
    if (typeof node === 'object' && 'props' in (node as any)) {
      return getTextContent((node as any).props.children)
    }
    return ''
  }, [])

  // Render the diagram using Kroki
  const renderDiagram = useCallback(async () => {
    const diagramCode = getTextContent(children)
    if (!diagramRef.current) return
    if (!diagramCode) {
      setSvgContent('')
      setError('Empty diagram source')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      diagramRef.current.innerHTML = ''

      // Preferred path: POST (handles long inputs, no encoding pitfalls)
      let response = await fetchSvgViaPost(type, diagramCode)

      // Fallback: GET with correct deflate + base64url
      if (!response.ok) {
        const errText = await response.text().catch(() => '')
        console.warn('Kroki POST failed -> trying GET', response.status, errText.slice(0, 200))
        response = await fetchSvgViaGet(type, diagramCode)
      }

      if (!response.ok) {
        const errText = await response.text().catch(() => '')
        throw new Error(`Kroki error ${response.status}: ${errText}`)
      }

      const svg = await response.text()
      if (!svg || (!svg.includes('<svg') && !svg.includes('<?xml'))) {
        throw new Error('Invalid SVG returned by Kroki')
      }

      diagramRef.current.innerHTML = svg
      setSvgContent(svg)
    } catch (err) {
      console.error('Kroki rendering error:', err)
      setError(err instanceof Error ? err.message : 'Failed to render diagram')
    } finally {
      setIsLoading(false)
    }
  }, [children, type, getTextContent])

  // Re-render when content/type changes
  useEffect(() => {
    renderDiagram()
  }, [renderDiagram])

  // Zoom
  const zoomIn = () => setZoomLevel(prev => Math.min(prev * 1.2, 5))
  const zoomOut = () => setZoomLevel(prev => Math.max(prev / 1.2, 0.1))
  const resetZoom = () => {
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
  }

  // Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true)
      setLastPanPoint({ x: e.clientX, y: e.clientY })
    }
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return
    const deltaX = e.clientX - lastPanPoint.x
    const deltaY = e.clientY - lastPanPoint.y
    setPanOffset(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }))
    setLastPanPoint({ x: e.clientX, y: e.clientY })
  }
  const handleMouseUp = () => setIsPanning(false)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoomLevel(prev => Math.max(0.1, Math.min(5, prev * delta)))
  }

  // Lightbox
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

  // Escape to close lightbox + lock scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLightboxOpen) closeLightbox()
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

  // Cursor feedback while panning
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

  // Copy diagram source
  const copyCode = async () => {
    try {
      const diagramCode = getTextContent(children)
      await navigator.clipboard.writeText(diagramCode)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Download SVG
  const downloadSvg = () => {
    if (!svgContent) return
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${title || 'kroki-diagram'}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Display name
  const getTypeDisplayName = (t: string) => {
    const typeMap: Record<string, string> = {
      plantuml: 'PlantUML',
      ditaa: 'Ditaa',
      blockdiag: 'BlockDiag',
      bpmn: 'BPMN',
      excalidraw: 'Excalidraw',
      graphviz: 'GraphViz',
      mermaid: 'Mermaid',
      nomnoml: 'Nomnoml',
      pikchr: 'Pikchr',
      vega: 'Vega',
      vegalite: 'Vega-Lite',
      wavedrom: 'WaveDrom'
    }
    return typeMap[t] || t.toUpperCase()
  }

  return (
    <Card className={`my-8 kroki-elegant-brutal ${className}`}>
      {title && (
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {getTypeDisplayName(type)}
              </Badge>
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={openLightbox} className="h-8 w-8 p-0" title="Open in lightbox">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={copyCode} className="h-8 w-8 p-0" title="Copy diagram code">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={downloadSvg} disabled={!svgContent} className="h-8 w-8 p-0" title="Download as SVG">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={renderDiagram} className="h-8 w-8 p-0" title="Refresh diagram">
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
                Rendering {getTypeDisplayName(type)} diagram...
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
            className="kroki-container cursor-pointer"
            onClick={openLightbox}
            title="Click to open in lightbox"
          />
        </div>
      </CardContent>

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm kroki-lightbox"
          onClick={closeLightbox}
        >
          <div
            ref={lightboxRef}
            className="relative bg-background w-full h-full overflow-hidden kroki-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 kroki-lightbox-header">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {getTypeDisplayName(type)}
                </Badge>
                <span className="font-semibold">{title || `${getTypeDisplayName(type)} Diagram`}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 zoom-controls p-1">
                  <Button variant="ghost" size="sm" onClick={zoomOut} className="h-6 w-6 p-0" title="Zoom out">
                    <ZoomOut className="h-3 w-3" />
                  </Button>
                  <span className="text-xs font-mono px-2 min-w-[3rem] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <Button variant="ghost" size="sm" onClick={zoomIn} className="h-6 w-6 p-0" title="Zoom in">
                    <ZoomIn className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={resetZoom} className="h-6 w-6 p-0" title="Reset zoom">
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>

                <Button variant="outline" size="sm" onClick={copyCode} className="h-8 w-8 p-0" title="Copy diagram code">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={downloadSvg} disabled={!svgContent} className="h-8 w-8 p-0" title="Download as SVG">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={closeLightbox} className="h-8 w-8 p-0" title="Close lightbox">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden flex-1">
              <div
                className="kroki-container overflow-hidden cursor-grab active:cursor-grabbing"
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

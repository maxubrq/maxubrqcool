'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ZoomIn, Download, ExternalLink } from 'lucide-react'

interface FigureProps {
  src: string
  alt?: string
  title?: string
  caption?: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  quality?: number
  fill?: boolean
  sizes?: string
  onClick?: () => void
}

// Cloudinary configuration
const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dmsb4anlx/image/upload'
const CLOUDINARY_VERSION = 'v1761479207'
const CLOUDINARY_FOLDER = 'maxubrqcool'

/**
 * Transforms a path to a Cloudinary URL if it starts with /maxubrqcool
 * @param path - The image path
 * @returns The transformed URL or original path
 */
function transformToCloudinaryUrl(path: string): string {
  if (path.startsWith('/maxubrqcool')) {
    // Remove the leading slash and construct the Cloudinary URL
    const imagePath = path.substring(1) // Remove leading slash
    return `${CLOUDINARY_BASE_URL}/${CLOUDINARY_VERSION}/${imagePath}`
  }
  return path
}

/**
 * Figure component with lightbox functionality and automatic Cloudinary URL handling
 */
export function Figure({
  src,
  alt = '',
  title,
  caption,
  className,
  width,
  height,
  priority = false,
  quality = 75,
  fill = false,
  sizes,
  onClick,
  ...props
}: FigureProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  
  // Transform the source URL for Cloudinary if needed
  const imageSrc = transformToCloudinaryUrl(src)

  const handleDownload = async () => {
    try {
      const response = await fetch(imageSrc)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = title || alt || 'image'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }

  const handleOpenInNewTab = () => {
    window.open(imageSrc, '_blank', 'noopener,noreferrer')
  }

  return (
    <Dialog>
      <figure className={cn('group relative inline-block', className)}>
        <DialogTrigger asChild>
          <div className="relative overflow-hidden rounded-sm border bg-muted/50 cursor-pointer">
            <Image
              src={imageSrc}
              alt={alt}
              width={width || 800}
              height={height || 600}
              priority={priority}
              quality={quality}
              fill={fill}
              sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
              className={cn(
                'transition-all duration-300 group-hover:scale-105',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
              {...props}
            />
            
            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
                <div className="w-8 h-8 border-2 border-muted-foreground/20 border-t-muted-foreground/60 rounded-full animate-spin" />
              </div>
            )}
            
            {/* Hover overlay with zoom icon */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white/90 dark:bg-black/90 rounded-full p-2 shadow-lg">
                <ZoomIn className="w-5 h-5 text-foreground" />
              </div>
            </div>
          </div>
        </DialogTrigger>
        
        {/* Caption */}
        {(title || caption) && (
          <figcaption className="mt-2 text-sm text-muted-foreground text-center">
            {title && <div className="font-medium text-foreground">{title}</div>}
            {caption && <div className="mt-1">{caption}</div>}
          </figcaption>
        )}
      </figure>

      {/* Lightbox Dialog Content */}
      <DialogContent className="max-w-7xl max-h-[90vh] p-0 bg-black/95 border-none">
        <DialogHeader className="absolute top-4 left-4 right-4 z-10 flex flex-row items-center justify-between">
          <DialogTitle className="text-white text-lg font-medium">
            {title || alt}
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenInNewTab}
              className="text-white hover:bg-white/20"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <Image
            src={imageSrc}
            alt={alt}
            width={1200}
            height={800}
            sizes="100vw"
            className="max-w-full max-h-[80vh] w-auto h-auto object-contain"
            priority
            quality={90}
          />
        </div>
        
        {/* Caption in lightbox */}
        {(title || caption) && (
          <div className="absolute bottom-4 left-4 right-4 z-10 text-center">
            <div className="bg-black/50 backdrop-blur-sm rounded-sm px-4 py-2 text-white text-sm">
              {title && <div className="font-medium">{title}</div>}
              {caption && <div className="mt-1 opacity-90">{caption}</div>}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

/**
 * Simple Figure component without lightbox for cases where you just need the image
 */
export function SimpleFigure({
  src,
  alt = '',
  title,
  caption,
  className,
  width,
  height,
  priority = false,
  quality = 75,
  fill = false,
  sizes,
  ...props
}: Omit<FigureProps, 'onClick'>) {
  const imageSrc = transformToCloudinaryUrl(src)
  
  return (
    <figure className={cn('group relative inline-block', className)}>
      <div className="relative overflow-hidden rounded-sm border bg-muted/50">
        <Image
          src={imageSrc}
          alt={alt}
          width={width || 800}
          height={height || 600}
          priority={priority}
          quality={quality}
          fill={fill}
          sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          className="transition-all duration-300"
          {...props}
        />
      </div>
      
      {(title || caption) && (
        <figcaption className="mt-2 text-sm text-muted-foreground text-center">
          {title && <div className="font-medium text-foreground">{title}</div>}
          {caption && <div className="mt-1">{caption}</div>}
        </figcaption>
      )}
    </figure>
  )
}

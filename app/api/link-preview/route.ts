import { NextRequest, NextResponse } from 'next/server'

interface LinkPreview {
  title?: string
  description?: string
  image?: string
  siteName?: string
  url: string
}

/**
 * Extracts Open Graph and meta tags from HTML content
 */
function extractMetadata(html: string, url: string): LinkPreview {
  const preview: LinkPreview = { url }

  // Extract title from <title> tag or og:title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i) ||
    html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]*name=["']og:title["'][^>]*content=["']([^"']+)["']/i)
  if (titleMatch) {
    preview.title = titleMatch[1].trim()
  }

  // Extract description from og:description or meta description
  const descMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
  if (descMatch) {
    preview.description = descMatch[1].trim()
  }

  // Extract image from og:image
  const imageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
  if (imageMatch) {
    const imageUrl = imageMatch[1].trim()
    // Convert relative URLs to absolute
    if (imageUrl.startsWith('http')) {
      preview.image = imageUrl
    } else if (imageUrl.startsWith('//')) {
      preview.image = `https:${imageUrl}`
    } else if (imageUrl.startsWith('/')) {
      try {
        const urlObj = new URL(url)
        preview.image = `${urlObj.protocol}//${urlObj.host}${imageUrl}`
      } catch {
        preview.image = imageUrl
      }
    } else {
      preview.image = imageUrl
    }
  }

  // Extract site name from og:site_name
  const siteNameMatch = html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i)
  if (siteNameMatch) {
    preview.siteName = siteNameMatch[1].trim()
  }

  return preview
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    )
  }

  // Validate URL
  let validatedUrl: URL
  try {
    validatedUrl = new URL(url)
  } catch {
    return NextResponse.json(
      { error: 'Invalid URL format' },
      { status: 400 }
    )
  }

  // Only allow http and https protocols
  if (!['http:', 'https:'].includes(validatedUrl.protocol)) {
    return NextResponse.json(
      { error: 'Only HTTP and HTTPS URLs are allowed' },
      { status: 400 }
    )
  }

  try {
    // Fetch the HTML content with a timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(validatedUrl.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreview/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.statusText}` },
        { status: response.status }
      )
    }

    const html = await response.text()
    const preview = extractMetadata(html, validatedUrl.toString())

    // Only return if we have at least a title or description
    if (!preview.title && !preview.description) {
      return NextResponse.json(
        { error: 'No preview data available' },
        { status: 404 }
      )
    }

    return NextResponse.json(preview)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout' },
        { status: 408 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch preview' },
      { status: 500 }
    )
  }
}


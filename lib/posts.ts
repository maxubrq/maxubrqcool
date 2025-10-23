import fs from 'fs'
import path from 'path'

const postsDirectory = path.join(process.cwd(), 'posts')
const metadataPath = path.join(postsDirectory, 'metadata.json')

export interface SeriesInfo {
  name: string
  part: number
  totalParts: number
  slug: string
}

export interface PostData {
  id: string
  title: string
  date: string
  excerpt: string
  contentHtml?: string
  isMDX?: boolean
  series?: SeriesInfo
}

// Load metadata from JSON file
function getMetadata(id: string) {
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
  return metadata[id] || null
}

export function getSortedPostsData(): Omit<PostData, 'contentHtml'>[] {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      // Remove ".md" or ".mdx" from file name to get id
      const id = fileName.replace(/\.(md|mdx)$/, '')
      const isMDX = fileName.endsWith('.mdx')

      // Get metadata from JSON file
      const metadata = getMetadata(id)
      
      if (!metadata) {
        return null
      }

      // Combine the data with the id
      return {
        id,
        title: metadata.title,
        date: metadata.date,
        excerpt: metadata.excerpt || '',
        isMDX: isMDX as boolean,
        series: metadata.series || undefined,
      }
    })
    .filter((post) => post !== null) as Omit<PostData, 'contentHtml'>[]
  
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
    .map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.(md|mdx)$/, ''),
        },
      }
    })
}

export function getPostData(id: string): PostData | null {
  try {
    // Try to find the file with .mdx or .md extension
    let fullPath = path.join(postsDirectory, `${id}.mdx`)
    let isMDX = true
    
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(postsDirectory, `${id}.md`)
      isMDX = false
    }
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    // Get metadata from JSON file
    const metadata = getMetadata(id)
    
    if (!metadata) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // For MDX files, we don't need to convert to HTML as Next.js handles it
    // For regular markdown files, we can still convert to HTML if needed
    let contentHtml: string | undefined
    
    if (!isMDX) {
      // For regular markdown, we can convert to HTML
      // But since we're moving to MDX, we'll keep this simple
      contentHtml = fileContents
    }

    // Combine the data with the id
    return {
      id,
      contentHtml,
      title: metadata.title,
      date: metadata.date,
      excerpt: metadata.excerpt || '',
      isMDX,
      series: metadata.series || undefined,
    }
  } catch (error) {
    return null
  }
}

// Get all unique series
export function getAllSeries(): Array<{ slug: string; name: string; totalParts: number; posts: Omit<PostData, 'contentHtml'>[] }> {
  const allPosts = getSortedPostsData()
  const seriesMap = new Map<string, { slug: string; name: string; totalParts: number; posts: Omit<PostData, 'contentHtml'>[] }>()

  allPosts.forEach(post => {
    if (post.series) {
      if (!seriesMap.has(post.series.slug)) {
        seriesMap.set(post.series.slug, {
          slug: post.series.slug,
          name: post.series.name,
          totalParts: post.series.totalParts,
          posts: []
        })
      }
      seriesMap.get(post.series.slug)!.posts.push(post)
    }
  })

  return Array.from(seriesMap.values()).map(series => ({
    ...series,
    posts: series.posts.sort((a, b) => {
      // Sort by series part number
      const partA = a.series?.part || 0
      const partB = b.series?.part || 0
      return partA - partB
    })
  }))
}

// Get series by slug
export function getSeriesBySlug(slug: string): { slug: string; name: string; totalParts: number; posts: Omit<PostData, 'contentHtml'>[] } | null {
  const allSeries = getAllSeries()
  return allSeries.find(series => series.slug === slug) || null
}

// Get previous and next posts in a series
export function getSeriesNavigation(postId: string): { 
  prev: Omit<PostData, 'contentHtml'> | null; 
  next: Omit<PostData, 'contentHtml'> | null;
  series: { slug: string; name: string } | null;
} {
  const post = getPostData(postId)
  
  if (!post || !post.series) {
    return { prev: null, next: null, series: null }
  }

  const series = getSeriesBySlug(post.series.slug)
  
  if (!series) {
    return { prev: null, next: null, series: null }
  }

  const currentIndex = series.posts.findIndex(p => p.id === postId)
  
  return {
    prev: currentIndex > 0 ? series.posts[currentIndex - 1] : null,
    next: currentIndex < series.posts.length - 1 ? series.posts[currentIndex + 1] : null,
    series: { slug: series.slug, name: series.name }
  }
}

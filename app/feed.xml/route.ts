import { getSortedPostsData } from '@/lib/posts'
import { NextResponse } from 'next/server'

// Helper function to escape XML content
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Convert date string (YYYY-MM-DD) or Date object to RFC 822 format for RSS
function formatRssDate(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput + 'T00:00:00Z') : dateInput
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const day = days[date.getUTCDay()]
  const dayNum = String(date.getUTCDate()).padStart(2, '0')
  const month = months[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')

  return `${day}, ${dayNum} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`
}

export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://maxubrqcool.com'
  const siteName = 'Maxubrqcool'
  const siteDescription =
    'Blog cá nhân về công nghệ, cuộc sống, và những thứ khác — có thể đọc, thử, và suy nghĩ cùng nhau.'

  const posts = getSortedPostsData()

  const rssItems = posts
    .map((post) => {
      const postUrl = `${siteUrl}/posts/${post.id}`
      const pubDate = formatRssDate(post.date)
      const title = escapeXml(post.title)
      const description = escapeXml(post.excerpt || '')

      return `    <item>
      <title>${title}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
    </item>`
    })
    .join('\n')

  const lastBuildDate = formatRssDate(new Date())

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}


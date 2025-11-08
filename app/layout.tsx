import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CommandPalette } from '@/components/CommandPalette'
import { CommandPaletteProvider } from '@/components/CommandPaletteContext'
import { ThemeProvider } from '@/components/ThemeProvider'
import { getSortedPostsData } from '@/lib/posts'
import { HeaderNav } from '@/components/HeaderNav'

const inter = Inter({ subsets: ['latin'] })

export function generateMetadata(): Metadata {
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://maxubrqcool.com'

  return {
    title: 'Maxubrqcool - Blog cá nhân về công nghệ, cuộc sống, và những thứ khác — có thể đọc, thử, và suy nghĩ cùng nhau.',
    description: 'Blog cá nhân về công nghệ, cuộc sống, và những thứ khác — có thể đọc, thử, và suy nghĩ cùng nhau.',
    icons: {
      icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon.ico', sizes: 'any' }
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
      ],
      other: [
        { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
      ]
    },
    manifest: '/site.webmanifest',
    alternates: {
      types: {
        'application/rss+xml': [{ url: `${siteUrl}/feed.xml`, title: 'RSS Feed' }],
      },
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const posts = getSortedPostsData()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Get the latest one from: https://katex.org/docs/browser */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+" crossOrigin="anonymous" />
        <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/feed.xml" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CommandPaletteProvider>
            <CommandPalette posts={posts} />
            <div className="min-h-screen bg-background">
          <HeaderNav />
          <main className="max-w-6xl mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t mt-16 bg-muted/50">
            <div className="max-w-6xl mx-auto px-4 py-8 text-center text-muted-foreground">
              <p>&copy; 2025 Maxubrqcool. All rights reserved.</p>
            </div>
          </footer>
          </div>
          </CommandPaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

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
  return {
    title: 'Maxubrqcool - Interactive Personal Blog',
    description: 'An interactive personal blog about technology, life, and everything in between. Experience engaging content with interactive components.',
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
    manifest: '/site.webmanifest'
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
              <p>&copy; 2024 Maxubrqcool. All rights reserved.</p>
            </div>
          </footer>
          </div>
          </CommandPaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

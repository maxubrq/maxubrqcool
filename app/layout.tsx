import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CommandPalette } from '@/components/CommandPalette'
import { SearchButton } from '@/components/SearchButton'
import { CommandPaletteProvider } from '@/components/CommandPaletteContext'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeToggle } from '@/components/ThemeToggle'
import { getSortedPostsData } from '@/lib/posts'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Maxubrqcool - Interactive Personal Blog',
  description: 'An interactive personal blog about technology, life, and everything in between. Experience engaging content with interactive components.',
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
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-6xl mx-auto px-4 py-6">
              <nav className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl font-bold">
                    <a href="/" className="hover:text-primary transition-colors">
                      Maxubrqcool
                    </a>
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" asChild>
                    <a href="/">Home</a>
                  </Button>
                  <Button variant="ghost" asChild>
                    <a href="/series">Series</a>
                  </Button>
                  <Button variant="ghost" asChild>
                    <a href="/tags">Tags</a>
                  </Button>
                  <Button variant="ghost" asChild>
                    <a href="/about">About</a>
                  </Button>
                  <SearchButton />
                  <ThemeToggle />
                </div>
              </nav>
            </div>
          </header>
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

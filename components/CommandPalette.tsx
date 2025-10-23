'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { useCommandPalette } from './CommandPaletteContext'

interface Post {
  id: string
  title: string
  excerpt: string
  series?: {
    name: string
    part: number
    totalParts: number
    slug: string
  }
}

interface CommandPaletteProps {
  posts: Post[]
}

export function CommandPalette({ posts }: CommandPaletteProps) {
  const router = useRouter()
  const { isOpen, openCommandPalette, closeCommandPalette } = useCommandPalette()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        openCommandPalette()
      }
      
      // Close on Escape
      if (e.key === 'Escape') {
        closeCommandPalette()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [openCommandPalette, closeCommandPalette])

  const runCommand = React.useCallback((command: () => void) => {
    closeCommandPalette()
    command()
  }, [closeCommandPalette])

  // Group posts by series and standalone
  const seriesPosts = posts.filter(post => post.series)
  const standalonePosts = posts.filter(post => !post.series)

  // Get unique series
  const seriesMap = new Map<string, { name: string; slug: string; posts: Post[] }>()
  seriesPosts.forEach(post => {
    if (post.series) {
      if (!seriesMap.has(post.series.slug)) {
        seriesMap.set(post.series.slug, {
          name: post.series.name,
          slug: post.series.slug,
          posts: []
        })
      }
      seriesMap.get(post.series.slug)!.posts.push(post)
    }
  })
  const uniqueSeries = Array.from(seriesMap.values())

  return (
    <CommandDialog open={isOpen} onOpenChange={closeCommandPalette}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {/* Navigation */}
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/'))}
          >
            <span className="mr-2">🏠</span>
            <span>Home</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/series'))}
          >
            <span className="mr-2">📚</span>
            <span>All Series</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/about'))}
          >
            <span className="mr-2">ℹ️</span>
            <span>About</span>
          </CommandItem>
        </CommandGroup>

        {/* Series */}
        {uniqueSeries.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Series">
              {uniqueSeries.map((series) => (
                <CommandItem
                  key={series.slug}
                  onSelect={() => runCommand(() => router.push(`/series/${series.slug}`))}
                >
                  <span className="mr-2">📖</span>
                  <span>{series.name}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {series.posts.length} parts
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Series Posts */}
        {seriesPosts.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Series Posts">
              {seriesPosts.map((post) => (
                <CommandItem
                  key={post.id}
                  onSelect={() => runCommand(() => router.push(`/posts/${post.id}`))}
                  className="flex items-start gap-2"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium line-clamp-1">
                        {post.title.split(' - ').slice(1).join(' - ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {post.series?.name}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Part {post.series?.part}
                      </Badge>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Standalone Posts */}
        {standalonePosts.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Posts">
              {standalonePosts.map((post) => (
                <CommandItem
                  key={post.id}
                  onSelect={() => runCommand(() => router.push(`/posts/${post.id}`))}
                >
                  <span className="mr-2">📝</span>
                  <span className="line-clamp-1">{post.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}


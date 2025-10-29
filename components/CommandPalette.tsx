'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
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
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <CommandInput 
          placeholder="Type a command or search..." 
          className="h-16 text-lg font-mono tracking-wide border-0 focus:ring-0 bg-transparent"
        />
      </motion.div>
      <CommandList className="max-h-[60vh]">
        <CommandEmpty className="py-16 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-bold tracking-wider text-muted-foreground">NO RESULTS</div>
            <div className="text-sm font-mono text-muted-foreground/60">Try a different search term</div>
          </div>
        </CommandEmpty>
        
        {/* Navigation */}
        <CommandGroup heading="NAVIGATION" className="px-4 py-6">
          <div className="space-y-1">
            <CommandItem
              onSelect={() => runCommand(() => router.push('/'))}
              className="h-14 px-6 rounded-none border-l-4 border-transparent hover:border-accent transition-all duration-200 group"
            >
              <div className="flex items-center gap-4 w-full">
                <div className="w-8 h-8 bg-black dark:bg-white rounded-sm flex items-center justify-center text-white dark:text-black font-bold text-sm group-hover:scale-110 transition-transform duration-200">
                  H
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold tracking-wide">HOME</div>
                  <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Main page</div>
                </div>
              </div>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/series'))}
              className="h-14 px-6 rounded-none border-l-4 border-transparent hover:border-accent transition-all duration-200 group"
            >
              <div className="flex items-center gap-4 w-full">
                <div className="w-8 h-8 bg-black dark:bg-white rounded-sm flex items-center justify-center text-white dark:text-black font-bold text-sm group-hover:scale-110 transition-transform duration-200">
                  S
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold tracking-wide">SERIES</div>
                  <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">All collections</div>
                </div>
              </div>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push('/about'))}
              className="h-14 px-6 rounded-none border-l-4 border-transparent hover:border-accent transition-all duration-200 group"
            >
              <div className="flex items-center gap-4 w-full">
                <div className="w-8 h-8 bg-black dark:bg-white rounded-sm flex items-center justify-center text-white dark:text-black font-bold text-sm group-hover:scale-110 transition-transform duration-200">
                  A
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold tracking-wide">ABOUT</div>
                  <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Information</div>
                </div>
              </div>
            </CommandItem>
          </div>
        </CommandGroup>

        {/* Series */}
        {uniqueSeries.length > 0 && (
          <>
            <CommandSeparator className="my-8" />
            <CommandGroup heading="SERIES" className="px-4 py-6">
              <div className="space-y-1">
                {uniqueSeries.map((series, index) => (
                  <motion.div
                    key={series.slug}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <CommandItem
                      onSelect={() => runCommand(() => router.push(`/series/${series.slug}`))}
                      className="h-16 px-6 rounded-none border-l-4 border-transparent hover:border-accent transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-sm flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-200">
                          {series.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="text-lg font-bold tracking-wide line-clamp-1">{series.name}</div>
                          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                            {series.posts.length} {series.posts.length === 1 ? 'PART' : 'PARTS'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wider">
                            SERIES
                          </div>
                        </div>
                      </div>
                    </CommandItem>
                  </motion.div>
                ))}
              </div>
            </CommandGroup>
          </>
        )}

        {/* Series Posts */}
        {seriesPosts.length > 0 && (
          <>
            <CommandSeparator className="my-8" />
            <CommandGroup heading="SERIES POSTS" className="px-4 py-6">
              <div className="space-y-1">
                {seriesPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                  >
                    <CommandItem
                      onSelect={() => runCommand(() => router.push(`/posts/${post.id}`))}
                      className="h-16 px-6 rounded-none border-l-4 border-transparent hover:border-accent transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-8 h-8 bg-muted rounded-sm flex items-center justify-center text-muted-foreground font-mono text-sm group-hover:bg-accent group-hover:text-white transition-all duration-200">
                          {post.series?.part}
                        </div>
                        <div className="flex-1">
                          <div className="text-base font-medium tracking-wide line-clamp-1">
                            {post.title.split(' - ').slice(1).join(' - ')}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                              {post.series?.name}
                            </div>
                            <div className="text-xs font-mono text-muted-foreground/60">
                              PART {post.series?.part}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wider">
                            POST
                          </div>
                        </div>
                      </div>
                    </CommandItem>
                  </motion.div>
                ))}
              </div>
            </CommandGroup>
          </>
        )}

        {/* Standalone Posts */}
        {standalonePosts.length > 0 && (
          <>
            <CommandSeparator className="my-8" />
            <CommandGroup heading="POSTS" className="px-4 py-6">
              <div className="space-y-1">
                {standalonePosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                  >
                    <CommandItem
                      onSelect={() => runCommand(() => router.push(`/posts/${post.id}`))}
                      className="h-14 px-6 rounded-none border-l-4 border-transparent hover:border-accent transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-8 h-8 bg-black dark:bg-white rounded-sm flex items-center justify-center text-white dark:text-black font-bold text-sm group-hover:scale-110 transition-transform duration-200">
                          P
                        </div>
                        <div className="flex-1">
                          <div className="text-base font-medium tracking-wide line-clamp-1">{post.title}</div>
                          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                            STANDALONE POST
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wider">
                            POST
                          </div>
                        </div>
                      </div>
                    </CommandItem>
                  </motion.div>
                ))}
              </div>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}


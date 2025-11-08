"use client"

import Link from 'next/link'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TagList } from '@/components/TagList'
import { HeroSection } from '@/components/HeroSection'
import { motion } from 'motion/react'
import { PostData } from '@/lib/posts'

interface PostContainerProps {
  post: PostData
  seriesNav: {
    series: { name: string; slug: string } | null
    prev: { id: string; title: string; series?: { part: number } } | null
    next: { id: string; title: string; series?: { part: number } } | null
  }
  children: React.ReactNode
}

export function PostContainer({ post, seriesNav, children }: PostContainerProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection
        title={post.title}
        subtitle={post.excerpt}
        meta={{
          label: "Article",
          value: format(new Date(post.date), 'MMM dd, yyyy').toUpperCase()
        }}
      />
      
      {/* Navigation */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 py-5 border-b border-border/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-6 mobile-nav">
            <Link 
              href="/" 
              className="text-xs text-muted-foreground hover:text-foreground transition-colors font-mono tracking-widest uppercase"
            >
              ← Back
            </Link>
            {post.series && (
              <Link 
                href={`/series/${post.series.slug}`}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-mono tracking-widest uppercase"
              >
                Series
              </Link>
            )}
          </div>
          <div className="hidden sm:block text-xs font-mono tracking-widest uppercase text-muted-foreground">
            {format(new Date(post.date), 'MMM dd, yyyy')}
          </div>
        </div>
      </motion.div>
      
      {/* Main Content - Book layout */}
      <motion.main 
        className="max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
      >
        <article className="mx-auto">
          <div className="prose prose-lg lg:prose-xl max-w-none leading-relaxed tracking-tight
                          prose-headings:font-serif prose-headings:tracking-tight prose-headings:leading-tight
                          prose-blockquote:border-l-2 prose-blockquote:border-muted/50">
            {children}
          </div>

          {/* Inline meta — subtle, book-like */}
          <div className="mt-10 pt-6 border-t border-border/30 flex items-center justify-between text-xs font-mono tracking-widest uppercase text-muted-foreground">
            <span>{format(new Date(post.date), 'MMM dd, yyyy')}</span>
          </div>

          {/* Tags at the end */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-6">
              <TagList 
                tags={post.tags}
                variant="outline"
                clickable={true}
                basePath="/tags"
                className="text-[11px] font-mono tracking-widest uppercase"
              />
            </div>
          )}
        </article>
      </motion.main>

      {/* Series Navigation */}
      {seriesNav.series && (seriesNav.prev || seriesNav.next) && (
        <motion.section 
          className="max-w-7xl mx-auto px-6 py-16 border-t border-border/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-1 h-4 bg-primary"></div>
              <span className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
                Series: {seriesNav.series.name}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Previous Post */}
              {seriesNav.prev ? (
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={`/posts/${seriesNav.prev.id}`} className="block group">
                    <div className="border border-border/40 p-8 hover:border-foreground/60 transition-colors">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground">← Previous</span>
                          <Badge variant="outline" className="text-[11px] font-mono tracking-widest uppercase">
                            Part {seriesNav.prev.series?.part}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                          {seriesNav.prev.title.split(' - ').slice(1).join(' - ')}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ) : (
                <div className="border border-border/20 p-8 opacity-60">
                  <div className="space-y-4">
                    <span className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground">← Previous</span>
                    <p className="text-sm text-muted-foreground">
                      This is the first post in the series
                    </p>
                  </div>
                </div>
              )}

              {/* Next Post */}
              {seriesNav.next ? (
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={`/posts/${seriesNav.next.id}`} className="block group">
                    <div className="border border-primary/60 p-8 hover:border-primary transition-colors bg-primary/5">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-[11px] font-mono tracking-widest uppercase">
                            Part {seriesNav.next.series?.part}
                          </Badge>
                          <span className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground">Next →</span>
                        </div>
                        <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                          {seriesNav.next.title.split(' - ').slice(1).join(' - ')}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ) : (
                <div className="border border-border/20 p-8 opacity-60">
                  <div className="space-y-4">
                    <span className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground">Next →</span>
                    <p className="text-sm text-muted-foreground">
                      This is the last post in the series
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* View All Parts Link */}
            <div className="pt-8 border-t border-border/20">
              <Button variant="outline" asChild className="font-mono tracking-widest uppercase text-xs">
                <Link href={`/series/${seriesNav.series?.slug}`}>
                  View All Parts in {seriesNav.series?.name} →
                </Link>
              </Button>
            </div>
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <motion.footer 
        className="max-w-7xl mx-auto px-6 py-16 border-t border-border/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2">
            <Link 
              href="/" 
              className="text-xs font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </Link>
            <p className="text-[11px] text-muted-foreground font-mono tracking-widest uppercase">
              {post.isMDX ? 'Interactive content' : 'Static content'}
            </p>
          </div>
          
          <div className="text-[11px] text-muted-foreground font-mono tracking-widest uppercase">
            © {new Date().getFullYear()} Maxubrqcool
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

"use client"

import Link from 'next/link'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TagList } from '@/components/TagList'
import { TableOfContents } from '@/components/TableOfContents'
import { PostLikeButtonSSR } from '@/components/PostLikeButton'
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
  renderedContent: React.ReactNode
}

export function PostContainer({ post, seriesNav, renderedContent }: PostContainerProps) {
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
        badges={post.isMDX ? ['Interactive'] : []}
      />
      
      {/* Navigation */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 border-b border-border/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 mobile-nav">
          <Link 
            href="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono tracking-wider"
          >
            ← Back to Home
          </Link>
          {post.series && (
            <Link 
              href={`/series/${post.series.slug}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono tracking-wider"
            >
              View Series →
            </Link>
          )}
        </div>
      </motion.div>
      
      {/* Tags and Like Button */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <TagList 
                tags={post.tags} 
                variant="outline" 
                clickable={true}
                basePath="/tags"
                className="text-xs font-mono tracking-wider"
              />
            </div>
          )}
          
          <PostLikeButtonSSR 
            postId={post.id}
            variant="text"
            size="lg"
            showCount={true}
            className="text-sm font-mono tracking-wider"
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.main 
        className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          {/* Content */}
          <article className="col-span-12 lg:col-span-8">
            <div className="prose prose-lg max-w-none">
              {renderedContent}
            </div>
          </article>
          
          {/* Sidebar TOC */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="sticky top-8">
              <TableOfContents />
            </div>
          </aside>
        </div>
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
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm font-mono tracking-wider uppercase text-muted-foreground">
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
                    <div className="border border-border/20 p-8 hover:border-border transition-colors">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono tracking-wider text-muted-foreground">
                            ← Previous
                          </span>
                          <Badge variant="outline" className="text-xs font-mono">
                            Part {seriesNav.prev.series?.part}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {seriesNav.prev.title.split(' - ').slice(1).join(' - ')}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ) : (
                <div className="border border-border/10 p-8 opacity-50">
                  <div className="space-y-4">
                    <span className="text-xs font-mono tracking-wider text-muted-foreground">
                      ← Previous
                    </span>
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
                    <div className="border border-primary/30 p-8 hover:border-primary transition-colors bg-primary/5">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs font-mono">
                            Part {seriesNav.next.series?.part}
                          </Badge>
                          <span className="text-xs font-mono tracking-wider text-muted-foreground">
                            Next →
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {seriesNav.next.title.split(' - ').slice(1).join(' - ')}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ) : (
                <div className="border border-border/10 p-8 opacity-50">
                  <div className="space-y-4">
                    <span className="text-xs font-mono tracking-wider text-muted-foreground">
                      Next →
                    </span>
                    <p className="text-sm text-muted-foreground">
                      This is the last post in the series
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* View All Parts Link */}
            <div className="pt-8 border-t border-border/20">
              <Button variant="outline" asChild className="font-mono tracking-wider">
                <Link href={`/series/${seriesNav.series.slug}`}>
                  View All Parts in {seriesNav.series.name} →
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
              className="text-sm font-mono tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Home
            </Link>
            <p className="text-xs text-muted-foreground font-mono">
              {post.isMDX ? 'Interactive content' : 'Static content'}
            </p>
          </div>
          
          <div className="text-xs text-muted-foreground font-mono tracking-wider">
            © {new Date().getFullYear()} Maxubrqcool
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

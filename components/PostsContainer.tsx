"use client"

import Link from 'next/link'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TagList } from '@/components/TagList'
import { ViewToggle } from '@/components/ViewToggle'
import { Pagination } from '@/components/Pagination'
import { PostListView } from '@/components/PostListView'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { PostData } from '@/lib/posts'

interface PostsContainerProps {
  allPosts: Omit<PostData, 'contentHtml'>[]
}

export function PostsContainer({ allPosts }: PostsContainerProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6

  // Calculate pagination
  const totalPages = Math.ceil(allPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = allPosts.slice(startIndex, endIndex)

  // Handle view change
  const handleViewChange = (view: 'grid' | 'list') => {
    setCurrentView(view)
    // Reset to first page when changing view
    setCurrentPage(1)
    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', view)
    params.set('page', '1')
    router.push(`/?${params.toString()}`)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/?${params.toString()}`)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Initialize state from URL params and localStorage
  useEffect(() => {
    const view = searchParams.get('view') as 'grid' | 'list' || 
                 localStorage.getItem('post-view-preference') as 'grid' | 'list' || 
                 'grid'
    const page = parseInt(searchParams.get('page') || '1')
    
    setCurrentView(view)
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }, [searchParams, totalPages])

  // Save view preference to localStorage
  useEffect(() => {
    localStorage.setItem('post-view-preference', currentView)
  }, [currentView])

  return (
    <TooltipProvider>
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to Maxubrqcool
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            An interactive personal blog about technology, life, and everything in between. 
            Experience engaging content with hands-on components and interactive elements.
          </p>
        </div>

        <Separator />

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Latest Posts</h2>
            <div className="flex items-center gap-4">
              <Badge variant="outline">{allPosts.length} posts</Badge>
              <ViewToggle 
                currentView={currentView} 
                onViewChange={handleViewChange}
              />
            </div>
          </div>
          
          {allPosts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground text-lg">No posts yet. Check back soon!</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {currentView === 'grid' ? (
                <div className="posts-grid">
                  {currentPosts.map((post) => (
                    <Card key={post.id} className="post-card group hover:shadow-xl transition-all duration-300 dark:hover:bg-card/90 dark:border-border/50 overflow-hidden h-[36rem] flex flex-col">
                      <CardHeader className="card-header pb-4 flex-shrink-0">
                        {/* Header with date and badges */}
                        <div className="flex items-start justify-between mb-4">
                          <time 
                            dateTime={post.date}
                            className="post-date"
                          >
                            {format(new Date(post.date), 'MMM dd, yyyy')}
                          </time>
                          <div className="card-badges">
                            {post.isMDX && (
                              <Badge variant="secondary" className="card-badge">
                                Interactive
                              </Badge>
                            )}
                            {post.series && (
                              <Badge variant="outline" className="card-badge">
                                Part {post.series.part}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Series info - more subtle */}
                        {post.series && (
                          <div className="mb-4">
                            <span className="series-name">
                              {post.series.name}
                            </span>
                          </div>
                        )}
                        
                        {/* Title - cleaner and more prominent */}
                        <CardTitle className="card-title group-hover:text-primary transition-colors dark:text-white dark:group-hover:text-primary mb-4">
                          <Link href={`/posts/${post.id}`} className="block">
                            {post.title}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="card-content pt-0 flex-1 flex flex-col justify-between">
                        {/* Excerpt - more space and better line height */}
                        <div className="flex-1 min-h-0">
                          <p className="card-excerpt line-clamp-4 leading-relaxed mb-4">
                            {post.excerpt}
                          </p>
                          {post.tags && post.tags.length > 0 && (
                            <div className="mb-4">
                              <TagList 
                                tags={post.tags.slice(0, 3)} 
                                variant="outline" 
                                size="sm"
                                clickable={true}
                                basePath="/tags"
                              />
                              {post.tags.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                  +{post.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Action button - always at bottom */}
                        <div className="mt-8 flex-shrink-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            asChild 
                            className="read-button w-full"
                          >
                            <Link href={`/posts/${post.id}`}>
                              Read Post
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <PostListView posts={currentPosts} />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

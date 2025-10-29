"use client"

import Link from 'next/link'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TagList } from '@/components/TagList'
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
import { motion } from 'motion/react'
import { PostCard } from '@/components/PostCard'
import { HeroSection } from '@/components/HeroSection'

interface PostsContainerProps {
  allPosts: Omit<PostData, 'contentHtml'>[]
}

export function PostsContainer({ allPosts }: PostsContainerProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6

  // Calculate pagination
  const totalPages = Math.ceil(allPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = allPosts.slice(startIndex, endIndex)


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

  // Initialize state from URL params
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1')
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }, [searchParams, totalPages])

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <HeroSection
          title="Maxubrqcool"
          subtitle="An interactive personal blog about technology, life, and everything in between. Experience engaging content with hands-on components and interactive elements."
          meta={{
            label: "Blog",
            value: `${allPosts.length} Articles`
          }}
        />

        {/* Posts Section */}
        <motion.main 
          className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="space-y-12">
                    <div className="flex items-center gap-4">
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Latest Posts</h2>
                      <Badge variant="outline" className="font-mono text-xs">
                        {allPosts.length} posts
                      </Badge>
                    </div>
          
            {allPosts.length === 0 ? (
              <motion.div
                className="text-center py-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-muted-foreground/20 rounded-full"></div>
                  </div>
                  <p className="text-muted-foreground text-lg font-mono tracking-wider">
                    No posts yet. Check back soon!
                  </p>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="space-y-0">
                  {currentPosts.map((post, index) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      index={index}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div 
                    className="flex justify-center mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </motion.div>
                )}
              </>
            )}
          </div>
        </motion.main>
      </div>
    </TooltipProvider>
  )
}

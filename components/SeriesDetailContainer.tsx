'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

interface Post {
  id: string
  title: string
  excerpt: string
  date: string
  series?: {
    part: number
  }
}

interface Series {
  name: string
  slug: string
  posts: Post[]
  totalParts: number
}

interface SeriesDetailContainerProps {
  series: Series
}

export function SeriesDetailContainer({ series }: SeriesDetailContainerProps) {
  const completedParts = series.posts.length
  const progressPercentage = (completedParts / series.totalParts) * 100
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return (
    <motion.article 
      ref={containerRef}
      className="max-w-6xl mx-auto"
      style={{ y }}
    >
      {/* Swiss Design Header */}
      <motion.div 
        className="relative mb-24"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Navigation */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground transition-colors">
            <Link href="/series">
              <span className="font-mono text-xs tracking-wider">← SERIES</span>
            </Link>
          </Button>
        </motion.div>

        {/* Swiss Grid Layout */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left Column - Meta Information */}
          <div className="col-span-3 space-y-8">
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-2">
                <div className="w-16 h-0.5 bg-foreground"></div>
                <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  Series
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="font-mono text-sm text-muted-foreground">
                  {completedParts} / {series.totalParts}
                </p>
                <p className="text-xs text-muted-foreground">Parts Complete</p>
              </div>
            </motion.div>

            {/* Swiss Progress Indicator */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs tracking-wider text-muted-foreground">PROGRESS</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="h-1 bg-muted relative overflow-hidden">
                  <motion.div 
                    className="h-full bg-foreground absolute top-0 left-0"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.6 }}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Main Content */}
          <div className="col-span-9 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h1 className="text-6xl font-black tracking-tight leading-none mb-8">
                {series.name}
              </h1>
              
              <div className="max-w-2xl">
                <p className="text-xl leading-relaxed text-muted-foreground font-light">
                  {series.posts[0].excerpt}
                </p>
              </div>
            </motion.div>

            {/* Swiss Design Elements */}
            <motion.div 
              className="flex items-center gap-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-foreground rounded-full"></div>
                <span className="font-mono text-sm tracking-wider text-muted-foreground">
                  {series.posts.length} ARTICLES
                </span>
              </div>
              <div className="w-16 h-px bg-muted"></div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-muted rounded-full"></div>
                <span className="font-mono text-sm tracking-wider text-muted-foreground">
                  SERIES
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Swiss Design Separator */}
      <motion.div 
        className="my-24"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-muted to-transparent"></div>
      </motion.div>

      {/* Swiss Posts Grid */}
      <motion.div 
        className="space-y-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        {/* Section Header */}
        <div className="grid grid-cols-12 gap-8 items-center">
          <div className="col-span-3">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <div className="w-24 h-0.5 bg-foreground"></div>
              <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                Articles
              </p>
            </motion.div>
          </div>
          <div className="col-span-9">
            <h2 className="text-4xl font-black tracking-tight">
              All Parts
            </h2>
          </div>
        </div>
        
        {/* Swiss Posts List */}
        <div className="space-y-8">
          {series.posts.map((post, index) => {
            const isFirst = index === 0
            const isLast = index === series.posts.length - 1
            
            return (
              <motion.div
                key={post.id}
                className="group"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1 + (index * 0.1),
                  ease: 'easeOut'
                }}
                whileHover={{ y: -4 }}
              >
                <div className="grid grid-cols-12 gap-8 items-start py-8 border-b border-muted/30 hover:border-muted transition-colors px-4">
                  {/* Left Column - Part Number & Meta */}
                  <div className="col-span-2">
                    <motion.div 
                      className="space-y-4"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-foreground text-background flex items-center justify-center font-mono text-sm font-bold">
                          {String(post.series?.part || index + 1).padStart(2, '0')}
                        </div>
                        {isFirst && (
                          <div className="w-16 h-0.5 bg-foreground"></div>
                        )}
                        {isLast && (
                          <div className="w-16 h-0.5 bg-muted"></div>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                          {isFirst ? 'Start' : isLast ? 'Latest' : 'Part'}
                        </p>
                        <time 
                          dateTime={post.date}
                          className="font-mono text-xs text-muted-foreground"
                        >
                          {format(new Date(post.date), 'MMM yyyy')}
                        </time>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Column - Content */}
                  <div className="col-span-10 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold tracking-tight group-hover:text-muted-foreground transition-colors">
                        <Link href={`/posts/${post.id}`} className="block">
                          {post.title.split(' - ').slice(1).join(' - ')}
                        </Link>
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed max-w-3xl">
                        {post.excerpt}
                      </p>
                    </div>

                    <motion.div 
                      className="flex items-center gap-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 + (index * 0.1) }}
                    >
                      <Button 
                        asChild 
                        variant="outline" 
                        className="font-mono text-xs tracking-wider hover:bg-foreground hover:text-background transition-all duration-200"
                      >
                        <Link href={`/posts/${post.id}`}>
                          READ ARTICLE →
                        </Link>
                      </Button>
                      
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-muted rounded-full"></div>
                        <div className="w-1 h-1 bg-muted rounded-full"></div>
                        <div className="w-1 h-1 bg-muted rounded-full"></div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Swiss Design Footer Navigation */}
      <motion.div 
        className="mt-32 pt-16 border-t border-muted/30"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* Left Navigation */}
          <div className="col-span-6">
            <motion.div
              whileHover={{ x: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                variant="ghost" 
                asChild 
                className="p-0 h-auto text-muted-foreground hover:text-foreground group"
              >
                <Link href="/series" className="flex items-center gap-4">
                  <div className="w-8 h-8 border border-muted group-hover:border-foreground transition-colors flex items-center justify-center">
                    <span className="font-mono text-xs">←</span>
                  </div>
                  <div className="space-y-1 text-left">
                    <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                      Back to
                    </p>
                    <p className="font-bold">All Series</p>
                  </div>
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Center Divider */}
          <div className="col-span-2 flex justify-center">
            <div className="w-px h-16 bg-muted"></div>
          </div>

          {/* Right Navigation */}
          <div className="col-span-4">
            <motion.div
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                asChild 
                className="w-full h-16 bg-foreground text-background hover:bg-muted-foreground transition-all duration-200 group"
              >
                <Link href={`/posts/${series.posts[0].id}`} className="flex items-center justify-between">
                  <div className="space-y-1 text-left">
                    <p className="font-mono text-xs tracking-wider opacity-70 uppercase">
                      Start Reading
                    </p>
                    <p className="font-bold">Part 01</p>
                  </div>
                  <div className="w-8 h-8 border border-background/20 group-hover:border-background transition-colors flex items-center justify-center">
                    <span className="font-mono text-xs">→</span>
                  </div>
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Swiss Design Footer Elements */}
        <motion.div 
          className="mt-16 pt-8 border-t border-muted/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.7 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="space-y-1">
                <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                  Series Progress
                </p>
                <p className="text-sm font-bold">
                  {completedParts} / {series.totalParts} Complete
                </p>
              </div>
              <div className="w-px h-8 bg-muted"></div>
              <div className="space-y-1">
                <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                  Completion
                </p>
                <p className="text-sm font-bold">
                  {Math.round(progressPercentage)}%
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-foreground rounded-full"></div>
              <div className="w-2 h-2 bg-muted rounded-full"></div>
              <div className="w-2 h-2 bg-muted rounded-full"></div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.article>
  )
}

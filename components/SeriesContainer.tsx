'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { motion } from 'motion/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface SeriesData {
  slug: string
  name: string
  totalParts: number
  posts: Array<{
    id: string
    title: string
    date: string
    excerpt: string
    series?: {
      slug: string
      name: string
      part: number
      totalParts: number
    }
  }>
}

interface SeriesContainerProps {
  allSeries: SeriesData[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3
    }
  }
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    scale: 0.9,
    rotateX: 15
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0
  },
  hover: {
    y: -8,
    scale: 1.02,
    rotateX: -2
  }
}

export function SeriesContainer({ allSeries }: SeriesContainerProps) {
  return (
    <div className="max-w-7xl mx-auto px-8 relative">
      {/* Swiss Grid Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}></div>
      </div>
      {/* Swiss Design Hero Section */}
      <motion.div 
        className="text-center space-y-8 mb-24 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Geometric Accent */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="w-16 h-16 bg-primary rotate-45"></div>
        </motion.div>

        {/* Typography Hierarchy */}
        <div className="space-y-6">
          <h1 className="text-6xl font-black tracking-tighter leading-none text-foreground">
            SERIES
          </h1>
          <div className="w-24 h-1 bg-foreground mx-auto"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            Comprehensive learning journeys designed with systematic precision
          </p>
        </div>

        {/* Swiss Grid Stats */}
        <motion.div 
          className="grid grid-cols-3 gap-8 max-w-md mx-auto mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center space-y-2">
            <div className="text-3xl font-black text-primary">{allSeries.length}</div>
            <div className="text-xs font-mono tracking-wider uppercase text-foreground">SERIES</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-black text-primary">
              {allSeries.reduce((acc, series) => acc + series.posts.length, 0)}
            </div>
            <div className="text-xs font-mono tracking-wider uppercase text-foreground">POSTS</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-3xl font-black text-primary">
              {Math.round(allSeries.reduce((acc, series) => acc + (series.posts.length / series.totalParts), 0) / allSeries.length * 100)}%
            </div>
            <div className="text-xs font-mono tracking-wider uppercase text-foreground">COMPLETE</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Swiss Grid Separator */}
      <motion.div 
        className="mb-16"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      </motion.div>

      {allSeries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="text-center py-24">
            <div className="w-32 h-32 border-2 border-dashed border-muted-foreground/30 mx-auto mb-8 flex items-center justify-center">
              <div className="text-4xl text-muted-foreground/50">📚</div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">NO SERIES YET</h3>
            <p className="text-muted-foreground font-mono text-sm tracking-wider uppercase">
              COMING SOON
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="grid gap-16 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {allSeries.map((series, seriesIndex) => {
            const firstPost = series.posts[0]
            const lastPost = series.posts[series.posts.length - 1]
            const completedParts = series.posts.length
            const progressPercentage = (completedParts / series.totalParts) * 100

            return (
              <motion.div
                key={series.slug}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  rotateX: -2,
                  transition: {
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="group"
              >
                {/* Swiss Design Card */}
                <div className="relative bg-background border-2 border-foreground shadow-[8px_8px_0px_0px_hsl(var(--foreground))] hover:shadow-[12px_12px_0px_0px_hsl(var(--foreground))] transition-all duration-300">
                  {/* Series Number Badge */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary text-primary-foreground font-black text-sm flex items-center justify-center border-2 border-foreground">
                    {String(seriesIndex + 1).padStart(2, '0')}
                  </div>

                  {/* Header Section */}
                  <div className="p-8 border-b-2 border-foreground">
                    <div className="flex items-start justify-between mb-6">
                      <div className="space-y-4 flex-1">
                        {/* Series Title */}
                        <div>
                          <h2 className="text-4xl font-black tracking-tight leading-none mb-2 text-foreground">
                            <Link 
                              href={`/series/${series.slug}`}
                              className="group-hover:text-primary transition-colors duration-200"
                            >
                              {series.name.toUpperCase()}
                            </Link>
                          </h2>
                          <div className="w-16 h-1 bg-primary"></div>
                        </div>

                        {/* Swiss Grid Info */}
                        <div className="grid grid-cols-3 gap-4 max-w-md">
                          <div className="text-center">
                            <div className="text-2xl font-black text-primary">{completedParts}</div>
                            <div className="text-xs font-mono tracking-wider uppercase text-foreground">PARTS</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-black text-primary">{series.totalParts}</div>
                            <div className="text-xs font-mono tracking-wider uppercase text-foreground">TOTAL</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-black text-primary">{Math.round(progressPercentage)}%</div>
                            <div className="text-xs font-mono tracking-wider uppercase text-foreground">DONE</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Swiss Progress Bar */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm font-mono tracking-wider uppercase text-foreground">
                        <span>PROGRESS</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <div className="relative h-3 bg-background border border-foreground overflow-hidden">
                        <motion.div 
                          className="absolute left-0 top-0 h-full bg-foreground"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%`, backgroundColor: 'var(--foreground)' }}
                          transition={{
                            duration: 1.2,
                            ease: [0.25, 0.46, 0.45, 0.94],
                            delay: 0.5 + seriesIndex * 0.1
                          }}
                        />
                      </div>
                    </div>

                    {/* Excerpt */}
                    <p className="mt-6 text-muted-foreground leading-relaxed font-light">
                      {firstPost.excerpt}
                    </p>
                  </div>

                  {/* Content Section */}
                  <div className="p-8">
                    {/* Post List - Swiss Grid */}
                    <div className="space-y-4 mb-8">
                      <h3 className="text-sm font-mono tracking-wider uppercase text-foreground">
                        ALL PARTS
                      </h3>
                      <div className="grid gap-2">
                        {series.posts.map((post, index) => (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                              duration: 0.3, 
                              delay: 0.8 + seriesIndex * 0.1 + index * 0.05,
                              ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                          >
                            <Link
                              href={`/posts/${post.id}`}
                              className="flex items-center justify-between p-4 border border-border hover:bg-primary hover:text-primary-foreground transition-all duration-200 group/item"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-6 h-6 bg-foreground text-background text-xs font-black flex items-center justify-center group-hover/item:bg-background group-hover/item:text-foreground transition-colors">
                                  {post.series?.part}
                                </div>
                                <span className="text-sm font-medium group-hover/item:text-primary-foreground transition-colors">
                                  {post.title.split(' - ').slice(1).join(' - ')}
                                </span>
                              </div>
                              <span className="text-xs font-mono tracking-wider group-hover/item:text-primary-foreground transition-colors">
                                {format(new Date(post.date), 'MMM dd').toUpperCase()}
                              </span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Swiss Action Buttons */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <Button asChild className="h-12 font-bold bg-background text-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:shadow-[6px_6px_0px_0px_hsl(var(--foreground))] hover:bg-foreground hover:text-background transition-all duration-200">
                        <Link href={`/series/${series.slug}`}>
                          VIEW SERIES
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="h-12 font-bold bg-transparent text-foreground border-2 border-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                        <Link href={`/posts/${firstPost.id}`}>
                          START READING →
                        </Link>
                      </Button>
                    </div>

                    {/* Swiss Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono tracking-wider uppercase text-muted-foreground border-t border-foreground pt-4">
                      <div>
                        <div className="text-primary font-bold">STARTED</div>
                        <div>{format(new Date(firstPost.date), 'MMM dd, yyyy').toUpperCase()}</div>
                      </div>
                      {lastPost && (
                        <div>
                          <div className="text-primary font-bold">UPDATED</div>
                          <div>{format(new Date(lastPost.date), 'MMM dd, yyyy').toUpperCase()}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}

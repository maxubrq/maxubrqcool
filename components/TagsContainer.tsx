'use client'

import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TagCloud } from '@/components/TagCloud'
import Link from 'next/link'

interface Tag {
  name: string
  count: number
}

interface TagsContainerProps {
  tags: Tag[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0
  }
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1
  },
  hover: {
    scale: 1.02
  }
}

export function TagsContainer({ tags }: TagsContainerProps) {
  return (
    <motion.div 
      className="max-w-4xl mx-auto px-6 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header 
        className="mb-16"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-muted-foreground mb-4">
          <span className="font-mono">Index</span>
          <span className="w-8 h-px bg-muted" />
          <span className="font-mono">Tags</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
          All Tags
        </h1>
        <p className="text-muted-foreground text-sm font-light tracking-wider">
          Explore posts by topic. Click on any tag to see all posts with that tag.
        </p>
      </motion.header>

      {/* Tags Index */}
      <motion.section 
        className="space-y-0"
        variants={containerVariants}
      >
        {tags.map((tag, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="group"
          >
            <Link 
              href={`/tags/${encodeURIComponent(tag.name)}`}
              className="block py-4 border-b border-muted/30 hover:border-muted/60 transition-colors duration-200"
            >
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-8">
                  <h2 className="text-lg font-light tracking-wider group-hover:text-primary transition-colors">
                    #{tag.name} ({tag.count})
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                  <span className="text-xs font-mono">View</span>
                  <svg 
                    className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.section>

      {/* Footer */}
      <motion.div 
        className="mt-16 pt-8 border-t border-muted/30"
        variants={itemVariants}
      >
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
          <Link href="/">← Back to Home</Link>
        </Button>
      </motion.div>
    </motion.div>
  )
}

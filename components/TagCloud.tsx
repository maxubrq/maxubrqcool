'use client'

import { motion } from 'motion/react'
import { Tag } from "@/components/ui/tag"
import Link from "next/link"

interface Tag {
  name: string
  count: number
}

interface TagCloudProps {
  tags: Tag[]
  className?: string
  maxTags?: number
  showCount?: boolean
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

const tagVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0
  },
  hover: {
    scale: 1.05,
    y: -2
  }
}

export function TagCloud({ 
  tags,
  className = "", 
  maxTags = 20, 
  showCount = false 
}: TagCloudProps) {
  const displayTags = tags.slice(0, maxTags)

  if (displayTags.length === 0) {
    return null
  }

  return (
    <motion.div 
      className={`flex flex-wrap gap-2 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {displayTags.map((tag, index) => (
        <motion.div
          key={index}
          variants={tagVariants}
          whileHover="hover"
        >
          <Link 
            href={`/tags/${encodeURIComponent(tag.name)}`}
            className="block"
          >
            <Tag 
              variant="outline" 
              size="default"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
            >
              {tag.name}
              {showCount && (
                <span className="ml-1 text-xs opacity-70">
                  ({tag.count})
                </span>
              )}
            </Tag>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}

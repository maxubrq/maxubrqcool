"use client"

import { motion } from 'motion/react'
import { Badge } from '@/components/ui/badge'

interface HeroSectionProps {
  title: string
  subtitle?: string
  meta?: {
    label: string
    value: string
  }
  badges?: string[]
  className?: string
}

export function HeroSection({ 
  title, 
  subtitle, 
  meta, 
  badges = [],
  className = "" 
}: HeroSectionProps) {
  return (
    <motion.section 
      className={`relative border-b border-border/20 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column - Meta */}
          <div className="col-span-12 lg:col-span-3 space-y-6 lg:space-y-8">
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="font-mono tracking-wider uppercase">
                  {meta?.label || 'Content'}
                </span>
              </div>
              
              {meta?.value && (
                <div className="text-sm text-muted-foreground font-mono">
                  {meta.value}
                </div>
              )}
              
              {badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs font-mono tracking-wider"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
          
          {/* Right Column - Title & Content */}
          <div className="col-span-12 lg:col-span-9">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-none text-foreground">
                {title}
              </h1>
              
              {subtitle && (
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-4xl">
                  {subtitle}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

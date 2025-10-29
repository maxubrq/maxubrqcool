'use client'

import * as React from 'react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { SearchButton } from '@/components/SearchButton'
import { ThemeToggle } from '@/components/ThemeToggle'

export function HeaderNav() {
  return (
    <motion.header 
      className="border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <a 
              href="/" 
              className="group flex items-center gap-3 hover:opacity-80 transition-all duration-200"
            >
              <div className="w-10 h-10 bg-black dark:bg-white rounded-sm flex items-center justify-center text-white dark:text-black font-bold text-lg group-hover:scale-110 transition-transform duration-200">
                M
              </div>
              <h1 className="text-2xl font-black tracking-tighter uppercase">
                Maxubrqcool
              </h1>
            </a>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Button 
                variant="ghost" 
                asChild
                className="h-12 px-6 font-mono text-sm tracking-wider uppercase hover:bg-accent/10 transition-all duration-200 rounded-none border-l-4 border-transparent hover:border-accent"
              >
                <a href="/">Home</a>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <Button 
                variant="ghost" 
                asChild
                className="h-12 px-6 font-mono text-sm tracking-wider uppercase hover:bg-accent/10 transition-all duration-200 rounded-none border-l-4 border-transparent hover:border-accent"
              >
                <a href="/series">Series</a>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button 
                variant="ghost" 
                asChild
                className="h-12 px-6 font-mono text-sm tracking-wider uppercase hover:bg-accent/10 transition-all duration-200 rounded-none border-l-4 border-transparent hover:border-accent"
              >
                <a href="/tags">Tags</a>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <Button 
                variant="ghost" 
                asChild
                className="h-12 px-6 font-mono text-sm tracking-wider uppercase hover:bg-accent/10 transition-all duration-200 rounded-none border-l-4 border-transparent hover:border-accent"
              >
                <a href="/about">About</a>
              </Button>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <SearchButton />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>
        </nav>
      </div>
    </motion.header>
  )
}



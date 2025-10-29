'use client'

import { Button } from '@/components/ui/button'
import { useCommandPalette } from './CommandPaletteContext'
import { motion } from 'motion/react'
import { Search } from 'lucide-react'

export function SearchButton() {
  const { openCommandPalette } = useCommandPalette()
  
  const handleClick = () => {
    openCommandPalette()
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      <Button 
        variant="outline" 
        className="h-10 px-4 gap-3 font-mono text-sm tracking-wide border-2 hover:border-accent transition-all duration-200 rounded-none group"
        onClick={handleClick}
      >
        <Search className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
        <span className="font-bold uppercase tracking-wider">Search</span>
        <div className="flex items-center gap-1 ml-2">
          <kbd className="pointer-events-none inline-flex h-6 w-6 select-none items-center justify-center rounded-sm border-2 border-muted-foreground/30 bg-muted/50 px-1 font-mono text-xs font-bold text-muted-foreground group-hover:border-accent group-hover:bg-accent/10 transition-all duration-200">
            ⌘
          </kbd>
          <kbd className="pointer-events-none inline-flex h-6 w-6 select-none items-center justify-center rounded-sm border-2 border-muted-foreground/30 bg-muted/50 px-1 font-mono text-xs font-bold text-muted-foreground group-hover:border-accent group-hover:bg-accent/10 transition-all duration-200">
            K
          </kbd>
        </div>
      </Button>
    </motion.div>
  )
}

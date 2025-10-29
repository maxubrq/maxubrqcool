'use client'

import * as React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'motion/react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  const getCurrentIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getCurrentLabel = () => {
    switch (theme) {
      case 'light':
        return 'LIGHT'
      case 'dark':
        return 'DARK'
      default:
        return 'SYSTEM'
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          <Button 
            variant="outline" 
            size="sm" 
            className="h-10 px-4 gap-3 font-mono text-sm tracking-wide border-2 hover:border-accent transition-all duration-200 rounded-none"
          >
            <motion.div
              key={theme}
              initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {getCurrentIcon()}
            </motion.div>
            <span className="font-bold uppercase tracking-wider">{getCurrentLabel()}</span>
            <span className="sr-only">Toggle theme</span>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 p-2 border-2 rounded-none bg-background/95 backdrop-blur-sm"
      >
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className="h-12 px-4 rounded-none hover:bg-accent/10 transition-all duration-200 group"
        >
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 bg-yellow-500 rounded-sm flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
              <Sun className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm tracking-wide">LIGHT</div>
              <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Bright mode
              </div>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className="h-12 px-4 rounded-none hover:bg-accent/10 transition-all duration-200 group"
        >
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 bg-slate-800 rounded-sm flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
              <Moon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm tracking-wide">DARK</div>
              <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Dark mode
              </div>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className="h-12 px-4 rounded-none hover:bg-accent/10 transition-all duration-200 group"
        >
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-sm flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
              <Monitor className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm tracking-wide">SYSTEM</div>
              <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Auto mode
              </div>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

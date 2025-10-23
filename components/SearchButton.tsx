'use client'

import { Button } from '@/components/ui/button'
import { useCommandPalette } from './CommandPaletteContext'

export function SearchButton() {
  const { openCommandPalette } = useCommandPalette()
  
  const handleClick = () => {
    openCommandPalette()
  }

  return (
    <Button 
      variant="outline" 
      className="gap-2 text-sm text-muted-foreground"
      onClick={handleClick}
    >
      <span>Search</span>
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  )
}

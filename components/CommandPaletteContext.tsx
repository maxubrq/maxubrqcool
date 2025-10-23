'use client'

import React, { createContext, useContext, useState } from 'react'

interface CommandPaletteContextType {
  isOpen: boolean
  openCommandPalette: () => void
  closeCommandPalette: () => void
  toggleCommandPalette: () => void
}

const CommandPaletteContext = createContext<CommandPaletteContextType | undefined>(undefined)

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openCommandPalette = () => setIsOpen(true)
  const closeCommandPalette = () => setIsOpen(false)
  const toggleCommandPalette = () => setIsOpen(prev => !prev)

  return (
    <CommandPaletteContext.Provider value={{
      isOpen,
      openCommandPalette,
      closeCommandPalette,
      toggleCommandPalette
    }}>
      {children}
    </CommandPaletteContext.Provider>
  )
}

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext)
  if (context === undefined) {
    throw new Error('useCommandPalette must be used within a CommandPaletteProvider')
  }
  return context
}

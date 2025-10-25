"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Grid3X3, 
  List, 
  LayoutGrid,
  List as ListIcon
} from "lucide-react"

interface ViewToggleProps {
  currentView: 'grid' | 'list'
  onViewChange: (view: 'grid' | 'list') => void
  className?: string
}

export function ViewToggle({ 
  currentView, 
  onViewChange, 
  className = "" 
}: ViewToggleProps) {
  return (
    <Card className={`p-1 ${className}`}>
      <div className="flex gap-1">
        <Button
          variant={currentView === 'grid' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('grid')}
          className="flex items-center gap-2"
        >
          <Grid3X3 className="h-4 w-4" />
          Grid
        </Button>
        <Button
          variant={currentView === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('list')}
          className="flex items-center gap-2"
        >
          <ListIcon className="h-4 w-4" />
          List
        </Button>
      </div>
    </Card>
  )
}

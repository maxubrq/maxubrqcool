"use client"

import { useState, useEffect } from "react"
import { Tag } from "@/components/ui/tag"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAllTags } from "@/lib/posts"

interface TagFilterProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  className?: string
}

export function TagFilter({ 
  selectedTags, 
  onTagsChange, 
  className = "" 
}: TagFilterProps) {
  const [availableTags, setAvailableTags] = useState<Array<{ name: string; count: number }>>([])

  useEffect(() => {
    setAvailableTags(getAllTags())
  }, [])

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter(tag => tag !== tagName))
    } else {
      onTagsChange([...selectedTags, tagName])
    }
  }

  const clearAllTags = () => {
    onTagsChange([])
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filter by Tags</h3>
        {selectedTags.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearAllTags}
          >
            Clear All
          </Button>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Selected tags:</p>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="default" 
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                onClick={() => toggleTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Available tags:</p>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag, index) => (
            <Tag
              key={index}
              variant={selectedTags.includes(tag.name) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => toggleTag(tag.name)}
            >
              {tag.name} ({tag.count})
            </Tag>
          ))}
        </div>
      </div>
    </div>
  )
}

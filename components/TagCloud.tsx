import { Tag } from "@/components/ui/tag"
import Link from "next/link"
import { getAllTags } from "@/lib/posts"

interface TagCloudProps {
  className?: string
  maxTags?: number
  showCount?: boolean
}

export function TagCloud({ 
  className = "", 
  maxTags = 20, 
  showCount = false 
}: TagCloudProps) {
  const tags = getAllTags().slice(0, maxTags)

  if (tags.length === 0) {
    return null
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <Link 
          key={index} 
          href={`/tags/${encodeURIComponent(tag.name)}`}
          className="transition-transform hover:scale-105"
        >
          <Tag 
            variant="outline" 
            size="default"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {tag.name}
            {showCount && (
              <span className="ml-1 text-xs opacity-70">
                ({tag.count})
              </span>
            )}
          </Tag>
        </Link>
      ))}
    </div>
  )
}

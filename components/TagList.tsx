import { Tag } from "@/components/ui/tag"
import Link from "next/link"

interface TagListProps {
  tags: string[]
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
  clickable?: boolean
  basePath?: string
}

export function TagList({ 
  tags, 
  variant = "secondary", 
  size = "default",
  className = "",
  clickable = false,
  basePath = "/tags"
}: TagListProps) {
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => {
        const tagElement = (
          <Tag key={index} variant={variant} size={size}>
            {tag}
          </Tag>
        )

        if (clickable) {
          return (
            <Link key={index} href={`${basePath}/${encodeURIComponent(tag)}`}>
              {tagElement}
            </Link>
          )
        }

        return tagElement
      })}
    </div>
  )
}

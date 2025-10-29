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
    <div className={`flex flex-wrap gap-x-3 gap-y-1 ${className}`}>
      {tags.map((tag) => {
        const label = `#${tag}`
        const TagText = (
          <span
            className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground focus:outline-none focus-visible:underline"
            title={label}
          >
            {label}
          </span>
        )

        return clickable ? (
          <Link
            key={tag}
            href={`${basePath}/${encodeURIComponent(tag)}`}
            aria-label={`View posts tagged ${tag}`}
            className="transition-colors"
          >
            {TagText}
          </Link>
        ) : (
          <span key={tag}>{TagText}</span>
        )
      })}
    </div>
  )
}

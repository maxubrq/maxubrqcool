import Link from 'next/link'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TagList } from '@/components/TagList'
import { PostData } from '@/lib/posts'

interface PostListViewProps {
  posts: Omit<PostData, 'contentHtml'>[]
}

export function PostListView({ posts }: PostListViewProps) {
  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground text-lg">No posts found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="post-list-item group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex gap-6">
              {/* Left side - Date and badges */}
              <div className="flex-shrink-0 w-32">
                <time 
                  dateTime={post.date}
                  className="text-sm text-muted-foreground block mb-2"
                >
                  {format(new Date(post.date), 'MMM dd, yyyy')}
                </time>
                <div className="flex flex-col gap-2">
                  {post.series && (
                    <Badge variant="outline" className="text-xs w-fit">
                      Part {post.series.part}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Right side - Content */}
              <div className="flex-1 min-w-0">
                {/* Series info */}
                {post.series && (
                  <div className="mb-2">
                    <span className="text-xs text-muted-foreground/80 font-medium tracking-wide uppercase">
                      {post.series.name}
                    </span>
                  </div>
                )}

                {/* Title */}
                <CardTitle className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors mb-3">
                  <Link href={`/posts/${post.id}`} className="block">
                    {post.title}
                  </Link>
                </CardTitle>

                {/* Excerpt */}
                <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-4">
                    <TagList 
                      tags={post.tags} 
                      variant="outline" 
                      size="sm"
                      clickable={true}
                      basePath="/tags"
                    />
                  </div>
                )}

                {/* Read button */}
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/posts/${post.id}`}>
                    Read Post →
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

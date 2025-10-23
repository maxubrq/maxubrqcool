import Link from 'next/link'
import { getSortedPostsData } from '@/lib/posts'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function Home() {
  const posts = getSortedPostsData()

  return (
    <TooltipProvider>
      <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Maxubrqcool
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          An interactive personal blog about technology, life, and everything in between. 
          Experience engaging content with hands-on components and interactive elements.
        </p>
      </div>

      <Separator />

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Latest Posts</h2>
          <Badge variant="outline">{posts.length} posts</Badge>
        </div>
        
        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground text-lg">No posts yet. Check back soon!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <Card key={post.id} className="post-card group hover:shadow-xl transition-all duration-300 dark:hover:bg-card/90 dark:border-border/50 overflow-hidden h-[36rem] flex flex-col">
                <CardHeader className="card-header pb-4 flex-shrink-0">
                  {/* Header with date and badges */}
                  <div className="flex items-start justify-between mb-4">
                    <time 
                      dateTime={post.date}
                      className="post-date"
                    >
                      {format(new Date(post.date), 'MMM dd, yyyy')}
                    </time>
                    <div className="card-badges">
                      {post.isMDX && (
                        <Badge variant="secondary" className="card-badge">
                          Interactive
                        </Badge>
                      )}
                      {post.series && (
                        <Badge variant="outline" className="card-badge">
                          Part {post.series.part}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Series info - more subtle */}
                  {post.series && (
                    <div className="mb-4">
                      <span className="series-name">
                        {post.series.name}
                      </span>
                    </div>
                  )}
                  
                  {/* Title - cleaner and more prominent */}
                  <CardTitle className="card-title group-hover:text-primary transition-colors dark:text-white dark:group-hover:text-primary mb-4">
                    <Link href={`/posts/${post.id}`} className="block">
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="card-content pt-0 flex-1 flex flex-col justify-between">
                  {/* Excerpt - more space and better line height */}
                  <div className="flex-1 min-h-0">
                    <p className="card-excerpt line-clamp-5 leading-relaxed mb-6">
                      {post.excerpt}
                    </p>
                  </div>
                  
                  {/* Action button - always at bottom */}
                  <div className="mt-8 flex-shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild 
                      className="read-button w-full"
                    >
                      <Link href={`/posts/${post.id}`}>
                        Read Post
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>
      </div>
    </TooltipProvider>
  )
}

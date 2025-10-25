import { notFound } from 'next/navigation'
import { getPostsByTag, getAllTags } from '@/lib/posts'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TagList } from '@/components/TagList'
import Link from 'next/link'

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map((tag) => ({
    tag: tag.name,
  }))
}

export default function TagPage({ params: { tag } }: { params: { tag: string } }) {
  const decodedTag = decodeURIComponent(tag)
  const posts = getPostsByTag(decodedTag)
  
  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Badge variant="default" className="text-lg px-4 py-2">
            #{decodedTag}
          </Badge>
          <span className="text-muted-foreground">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Posts tagged with &ldquo;{decodedTag}&rdquo;
        </h1>
      </div>

      <Separator />

      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <time 
                  dateTime={post.date}
                  className="text-sm text-muted-foreground"
                >
                  {format(new Date(post.date), 'MMMM dd, yyyy')}
                </time>
                <div className="flex gap-2">
                  {post.isMDX && (
                    <Badge variant="secondary" className="animate-pulse">
                      Interactive
                    </Badge>
                  )}
                  {post.series && (
                    <Badge variant="outline">
                      Part {post.series.part}
                    </Badge>
                  )}
                </div>
              </div>
              
              {post.series && (
                <div className="mb-2">
                  <span className="text-sm text-muted-foreground">
                    {post.series.name}
                  </span>
                </div>
              )}
              
              <CardTitle className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                <Link href={`/posts/${post.id}`} className="block">
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {post.excerpt}
              </p>
              
              {post.tags && post.tags.length > 0 && (
                <div className="mb-4">
                  <TagList 
                    tags={post.tags} 
                    variant="secondary" 
                    size="sm"
                    clickable={true}
                    basePath="/tags"
                  />
                </div>
              )}
              
              <Button variant="outline" asChild>
                <Link href={`/posts/${post.id}`}>
                  Read Post →
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      <div className="flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link href="/">← Back to Home</Link>
        </Button>
        <div className="text-sm text-muted-foreground">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
        </div>
      </div>
    </div>
  )
}

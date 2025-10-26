import { notFound } from 'next/navigation'
import { getPostData, getAllPostIds, getSeriesNavigation } from '@/lib/posts'
import { format } from 'date-fns'
import dynamicImport from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TagList } from '@/components/TagList'
import { TableOfContents } from '@/components/TableOfContents'
import { PostLikeButtonSSR } from '@/components/PostLikeButton'
import Link from 'next/link'

// Disable static generation for posts with interactive components
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateStaticParams() {
  const paths = getAllPostIds()
  return paths.map((path) => ({
    id: path.params.id,
  }))
}

export default function Post({ params: { id } }: { params: { id: string } }) {
  const post = getPostData(id)
  
  if (!post) {
    notFound()
  }

  // Get series navigation if this post is part of a series
  const seriesNav = getSeriesNavigation(id)

  // Dynamically import MDX content if it's an MDX file
  let MDXContent: React.ComponentType | null = null
  
  if (post.isMDX) {
    try {
      MDXContent = dynamicImport(() => import(`../../../posts/${id}.mdx`), {
        loading: () => (
          <Card>
            <CardContent className="p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        )
      })
    } catch (error) {
      console.error('Error loading MDX content:', error)
    }
  }

  return (
    <>
      <div className="flex gap-8 max-w-7xl mx-auto">
        {/* Main Content */}
        <article className="flex-1 max-w-4xl space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <time 
              dateTime={post.date}
              className="text-sm text-muted-foreground"
            >
              {format(new Date(post.date), 'MMMM dd, yyyy')}
            </time>
            {post.isMDX && (
              <Badge variant="secondary" className="animate-pulse">
                Interactive
              </Badge>
            )}
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            {post.title}
          </CardTitle>
          
          {/* Post Like Button */}
          <div className="mt-4 flex items-center gap-4">
            <PostLikeButtonSSR 
              postId={post.id}
              variant="text"
              size="md"
              showCount={true}
            />
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4">
              <TagList 
                tags={post.tags} 
                variant="secondary" 
                clickable={true}
                basePath="/tags"
              />
            </div>
          )}
        </CardHeader>
            <CardContent>
              {post.isMDX && MDXContent ? (
                <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-white prose-p:text-gray-200 prose-strong:text-white prose-a:text-primary hover:prose-a:text-primary/80">
                  <MDXContent />
                </div>
              ) : (
                <div 
                  className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-white prose-p:text-gray-200 prose-strong:text-white prose-a:text-primary hover:prose-a:text-primary/80"
                  dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
                />
              )}
            </CardContent>
      </Card>

      <Separator />

      {/* Series Navigation */}
      {seriesNav.series && (seriesNav.prev || seriesNav.next) && (
        <>
          <Card className="bg-muted/50">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="default" className="text-xs">
                  📚 Series
                </Badge>
                <span className="text-sm font-medium">{seriesNav.series.name}</span>
              </div>
              <CardTitle className="text-xl">Continue Reading</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Previous Post */}
                {seriesNav.prev ? (
                  <Link href={`/posts/${seriesNav.prev.id}`}>
                    <Card className="h-full hover:bg-muted transition-colors cursor-pointer">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            ← Previous
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Part {seriesNav.prev.series?.part}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium line-clamp-2 leading-relaxed">
                          {seriesNav.prev.title.split(' - ').slice(1).join(' - ')}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ) : (
                  <div className="opacity-50">
                    <Card className="h-full">
                      <CardContent className="p-6 space-y-4">
                        <Badge variant="outline" className="text-xs">
                          ← Previous
                        </Badge>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          This is the first post in the series
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Next Post */}
                {seriesNav.next ? (
                  <Link href={`/posts/${seriesNav.next.id}`}>
                    <Card className="h-full hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer border-primary">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            Part {seriesNav.next.series?.part}
                          </Badge>
                          <Badge variant="default" className="text-xs">
                            Next →
                          </Badge>
                        </div>
                        <p className="text-sm font-medium line-clamp-2 leading-relaxed">
                          {seriesNav.next.title.split(' - ').slice(1).join(' - ')}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ) : (
                  <div className="opacity-50">
                    <Card className="h-full">
                      <CardContent className="p-6 space-y-4">
                        <Badge variant="outline" className="text-xs">
                          Next →
                        </Badge>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          This is the last post in the series
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* View All Parts Link */}
              <div className="mt-8 pt-6 border-t">
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/series/${seriesNav.series.slug}`}>
                    View All Parts in {seriesNav.series.name} →
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Separator />
        </>
      )}

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link href="/">← Back to Home</Link>
        </Button>
        <div className="text-sm text-muted-foreground">
          {post.isMDX ? 'Interactive content' : 'Static content'}
        </div>
      </div>
        </article>
        
        {/* Sidebar TOC */}
        <TableOfContents />
      </div>
    </>
  )
}

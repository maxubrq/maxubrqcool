import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSeriesBySlug, getAllSeries } from '@/lib/posts'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export async function generateStaticParams() {
  const allSeries = getAllSeries()
  return allSeries.map((series) => ({
    slug: series.slug,
  }))
}

export default function SeriesDetailPage({ params: { slug } }: { params: { slug: string } }) {
  const series = getSeriesBySlug(slug)
  
  if (!series) {
    notFound()
  }

  const completedParts = series.posts.length
  const progressPercentage = (completedParts / series.totalParts) * 100

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/series">← All Series</Link>
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-sm">
              📚 Series
            </Badge>
            <Badge variant="outline" className="text-sm">
              {completedParts} of {series.totalParts} parts
            </Badge>
          </div>

          <h1 className="text-4xl font-bold tracking-tight">
            {series.name}
          </h1>

          <p className="text-xl text-muted-foreground">
            {series.posts[0].excerpt}
          </p>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Series Progress</span>
              <span className="text-muted-foreground">
                {completedParts} / {series.totalParts} parts ({Math.round(progressPercentage)}%)
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Posts List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">All Parts</h2>
        
        <div className="space-y-4">
          {series.posts.map((post, index) => {
            const isFirst = index === 0
            const isLast = index === series.posts.length - 1
            
            return (
              <Card 
                key={post.id} 
                className={`group hover:shadow-lg transition-all duration-200 ${
                  isFirst ? 'border-primary border-2' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="text-lg px-3 py-1">
                        Part {post.series?.part}
                      </Badge>
                      {isFirst && (
                        <Badge variant="secondary" className="text-xs">
                          Start Here
                        </Badge>
                      )}
                      {isLast && (
                        <Badge variant="secondary" className="text-xs">
                          Latest
                        </Badge>
                      )}
                    </div>
                    <time 
                      dateTime={post.date}
                      className="text-sm text-muted-foreground"
                    >
                      {format(new Date(post.date), 'MMM dd, yyyy')}
                    </time>
                  </div>

                  <CardTitle className="group-hover:text-primary transition-colors">
                    <Link href={`/posts/${post.id}`}>
                      {post.title.split(' - ').slice(1).join(' - ')}
                    </Link>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <CardDescription className="line-clamp-2">
                    {post.excerpt}
                  </CardDescription>

                  <div className="flex gap-3">
                    <Button asChild className="flex-1">
                      <Link href={`/posts/${post.id}`}>
                        Read Post →
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link href="/series">← All Series</Link>
        </Button>
        
        <Button asChild>
          <Link href={`/posts/${series.posts[0].id}`}>
            Start Reading →
          </Link>
        </Button>
      </div>
    </article>
  )
}


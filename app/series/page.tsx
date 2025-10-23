import Link from 'next/link'
import { getAllSeries } from '@/lib/posts'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function SeriesPage() {
  const allSeries = getAllSeries()

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          📚 Blog Series
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore our comprehensive series covering various topics in-depth. 
          Follow along from start to finish for a complete learning experience.
        </p>
        <div className="flex justify-center gap-2 mt-6">
          <Badge variant="secondary">{allSeries.length} Series</Badge>
          <Badge variant="outline">
            {allSeries.reduce((acc, series) => acc + series.posts.length, 0)} Posts
          </Badge>
        </div>
      </div>

      <Separator />

      {allSeries.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No series available yet. Check back soon!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {allSeries.map((series) => {
            const firstPost = series.posts[0]
            const lastPost = series.posts[series.posts.length - 1]
            const completedParts = series.posts.length
            const progressPercentage = (completedParts / series.totalParts) * 100

            return (
              <Card key={series.slug} className="group hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-sm">
                          📚 Series
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                          {completedParts} of {series.totalParts} parts
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                        <Link href={`/series/${series.slug}`}>
                          {series.name}
                        </Link>
                      </CardTitle>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Progress</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <CardDescription className="mt-4">
                    {firstPost.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Post List */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground">
                      All Parts:
                    </h4>
                    <div className="grid gap-2">
                      {series.posts.map((post) => (
                        <Link
                          key={post.id}
                          href={`/posts/${post.id}`}
                          className="flex items-center justify-between p-3 rounded-sm border hover:bg-muted/50 transition-colors group/item"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              Part {post.series?.part}
                            </Badge>
                            <span className="text-sm font-medium group-hover/item:text-primary transition-colors">
                              {post.title.split(' - ').slice(1).join(' - ')}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(post.date), 'MMM dd')}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button asChild className="flex-1">
                      <Link href={`/series/${series.slug}`}>
                        View Series
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="flex-1">
                      <Link href={`/posts/${firstPost.id}`}>
                        Start Reading →
                      </Link>
                    </Button>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                    <span>
                      Started: {format(new Date(firstPost.date), 'MMM dd, yyyy')}
                    </span>
                    {lastPost && (
                      <span>
                        Last Updated: {format(new Date(lastPost.date), 'MMM dd, yyyy')}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}


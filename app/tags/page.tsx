import { getAllTags } from '@/lib/posts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TagCloud } from '@/components/TagCloud'
import Link from 'next/link'

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          All Tags
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore posts by topic. Click on any tag to see all posts with that tag.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="text-lg px-4 py-2">
            {tags.length} {tags.length === 1 ? 'tag' : 'tags'} available
          </Badge>
        </div>
      </div>

      <Separator />

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-6">Tag Cloud</h2>
          <Card>
            <CardContent className="p-8">
              <TagCloud 
                maxTags={50} 
                showCount={true}
                className="justify-center"
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-6">All Tags</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map((tag, index) => (
              <Link key={index} href={`/tags/${encodeURIComponent(tag.name)}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                        #{tag.name}
                      </CardTitle>
                      <Badge variant="secondary">
                        {tag.count} {tag.count === 1 ? 'post' : 'posts'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">
                      Click to view all posts tagged with "{tag.name}"
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex justify-center">
        <Button variant="outline" asChild>
          <Link href="/">← Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}

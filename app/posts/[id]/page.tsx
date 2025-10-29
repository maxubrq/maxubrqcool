import { PostContainer } from '@/components/PostContainer'
import { getAllPostIds, getPostData, getSeriesNavigation } from '@/lib/posts'
import { Card, CardContent } from '@/components/ui/card'
import dynamicImport from 'next/dynamic'
import { notFound } from 'next/navigation'

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

  // Render the content in the server component
  const renderedContent = post.isMDX && MDXContent ? (
    <MDXContent />
  ) : (
    <div dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }} />
  )

  return (
    <PostContainer 
      post={post}
      seriesNav={seriesNav}
      renderedContent={renderedContent}
    />
  )
}

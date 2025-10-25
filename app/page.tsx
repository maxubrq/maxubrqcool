import { getSortedPostsData } from '@/lib/posts'
import { PostsContainer } from '@/components/PostsContainer'

export default function Home() {
  const allPosts = getSortedPostsData()

  return <PostsContainer allPosts={allPosts} />
}

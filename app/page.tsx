import { getSortedPostsData } from '@/lib/posts'
import { PostsContainer } from '@/components/PostsContainer'
import { Suspense } from 'react'

export default function Home() {
  const allPosts = getSortedPostsData()

  return <Suspense fallback={<div>Loading...</div>}>
    <PostsContainer allPosts={allPosts} />
  </Suspense>
}

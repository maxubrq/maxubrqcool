import { getAllTags } from '@/lib/posts'
import { TagsContainer } from '@/components/TagsContainer'

export default function TagsPage() {
  const tags = getAllTags()

  return <TagsContainer tags={tags} />
}

import { getAllSeries } from '@/lib/posts'
import { SeriesContainer } from '@/components/SeriesContainer'

export default function SeriesPage() {
  const allSeries = getAllSeries()

  return <SeriesContainer allSeries={allSeries} />
}


import { notFound } from 'next/navigation'
import { getSeriesBySlug, getAllSeries } from '@/lib/posts'
import { SeriesDetailContainer } from '@/components/SeriesDetailContainer'

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

  return <SeriesDetailContainer series={series} />
}


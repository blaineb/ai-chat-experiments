import  ResultsCarousel from '@/components/results-carousel'
import { ChartCard } from '@/components/chart-card'

export default function PiecesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 ">

      <div className="flex flex-col pb-32 pt-8 space-y-4" style={{ width: '568px' }}>
        <ResultsCarousel />
        <ChartCard />
      </div>
    </main>
  )
}
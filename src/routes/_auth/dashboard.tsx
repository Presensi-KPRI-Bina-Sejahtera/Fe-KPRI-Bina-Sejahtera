import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { ActivitiesTable } from '@/components/dashboard/activities-table'
import { SectionCards } from '@/components/dashboard/section-cards'
import { ChartLineDots } from '@/components/dashboard/chart-line-dots'
import { ChartBarMultiple } from '@/components/dashboard/chart-bar-multiple'
import { getDashboardData } from '@/services/dashboardService'

export const Route = createFileRoute('/_auth/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
  })

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Gagal memuat data dashboard.
      </div>
    )
  }
  return (
    <div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards stats={data?.statistik} />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
              <div className="lg:col-span-2">
                <ChartLineDots chartData={data?.grafik} />
              </div>
              <div className="lg:col-span-3">
                <ChartBarMultiple chartData={data?.grafik} />
              </div>
            </div>
            <ActivitiesTable activities={data?.pulang_laporan_setoran || []} />
          </div>
        </div>
      </div>
    </div>
  )
}

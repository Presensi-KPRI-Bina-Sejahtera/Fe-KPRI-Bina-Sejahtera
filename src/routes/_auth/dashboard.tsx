import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { DashboardTable } from '@/components/dashboard/dashboard-table'
import { DashboardCards } from '@/components/dashboard/dashboard-cards'
import { DashboardLineChart } from '@/components/dashboard/dashboard-line-chart'
import { DashboardBarChart } from '@/components/dashboard/dashboard-bar-chart'
import { getDashboardData } from '@/services/dashboardService'
import LoadingPage from '@/components/loading-page'
import ErrorPage from '@/components/error-page'

export const Route = createFileRoute('/_auth/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
  })

  if (isLoading) {
    return <LoadingPage />
  }

  if (error) {
    return <ErrorPage page="dashboard" />
  }

  return (
    <div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DashboardCards stats={data?.statistik} />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
              <div className="lg:col-span-2">
                <DashboardLineChart chartData={data?.grafik} />
              </div>
              <div className="lg:col-span-3">
                <DashboardBarChart chartData={data?.grafik} />
              </div>
            </div>
            <DashboardTable activities={data?.pulang_laporan_setoran || []} />
          </div>
        </div>
      </div>
    </div>
  )
}

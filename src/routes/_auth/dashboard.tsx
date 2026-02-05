import { createFileRoute } from '@tanstack/react-router'
import { ActivitiesTable } from '@/components/dashboard/activities-table'
import { SectionCards } from '@/components/dashboard/section-cards'
import { ChartLineDots } from '@/components/dashboard/chart-line-dots'
import { ChartBarMultiple } from '@/components/dashboard/chart-bar-multiple'

export const Route = createFileRoute('/_auth/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
              <div className="lg:col-span-2">
                <ChartLineDots />
              </div>
              <div className="lg:col-span-3">
                <ChartBarMultiple />
              </div>
            </div>
            <ActivitiesTable />
          </div>
        </div>
      </div>
    </div>
  )
}

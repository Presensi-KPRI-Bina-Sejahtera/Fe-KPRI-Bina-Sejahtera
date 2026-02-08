import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { getAttendanceList } from '@/services/attendanceService'
import { KehadiranHeader } from '@/components/kehadiran/kehadiran-header'
import { KehadiranFilters } from '@/components/kehadiran/kehadiran-filters'
import { KehadiranStats } from '@/components/kehadiran/kehadiran-stats'
import { KehadiranTable } from '@/components/kehadiran/kehadiran-table'
import LoadingPage from '@/components/loading-page'
import ErrorPage from '@/components/error-page'

const attendanceSearchSchema = z.object({
  page: z.number().catch(1),
  per_page: z.number().catch(10),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  user_id: z.string().optional(),
  search: z.string().optional(),
})

export const Route = createFileRoute('/_auth/kehadiran')({
  validateSearch: (search) => attendanceSearchSchema.parse(search),
  component: KehadiranPage,
})

function KehadiranPage() {
  const search = Route.useSearch()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['attendance', search],
    queryFn: () => getAttendanceList(search),
    placeholderData: (previousData) => previousData,
  })

  if (isLoading) {
    return <LoadingPage />
  }

  if (error) {
    return (
      <ErrorPage 
        title="Gagal Memuat Data Kehadiran" 
        error={error} 
        reset={refetch} 
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <KehadiranHeader currentFilters={search} />
      <KehadiranFilters currentFilters={search} />
      <KehadiranStats summary={data?.summary} />
      <KehadiranTable
        data={data?.attendances || []}
        pagination={{
          pageIndex: (data?.current_page || 1) - 1,
          pageSize: data?.per_page || 10,
          pageCount: data?.last_page || 1,
          total: data?.total || 0,
        }}
      />
    </div>
  )
}
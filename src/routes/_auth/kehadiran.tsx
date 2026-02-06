import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { getAttendanceList } from '@/services/attendanceService'
import { KehadiranHeader } from '@/components/kehadiran/kehadiran-header'
import { KehadiranFilters } from '@/components/kehadiran/kehadiran-filters'
import { KehadiranStats } from '@/components/kehadiran/kehadiran-stats'
import { KehadiranTable } from '@/components/kehadiran/kehadiran-table'

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

  const { data, isLoading, error } = useQuery({
    queryKey: ['attendance', search], 
    queryFn: () => getAttendanceList(search),
    placeholderData: (previousData) => previousData, 
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Terjadi kesalahan saat memuat data. Silakan coba lagi.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <KehadiranHeader />
      
      <KehadiranFilters currentFilters={search} />
      
      <KehadiranStats summary={data?.summary} />
      
      <KehadiranTable 
        data={data?.attendances || []} 
        pagination={{
          pageIndex: (data?.current_page || 1) - 1,
          pageSize: data?.per_page || 10,
          pageCount: data?.last_page || 1,
          total: data?.total || 0
        }}
      />
    </div>
  )
}
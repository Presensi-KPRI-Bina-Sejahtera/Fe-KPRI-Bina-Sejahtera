import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { getDepositList } from '@/services/depositService'
import { SetoranHeader } from '@/components/setoran/setoran-header'
import { SetoranFilters } from '@/components/setoran/setoran-filters'
import { SetoranSearch } from '@/components/setoran/setoran-search'
import { SetoranTable } from '@/components/setoran/setoran-table'

const depositSearchSchema = z.object({
  page: z.number().catch(1),
  per_page: z.number().catch(10),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  search: z.string().optional(),
  type: z.enum(['simpanan', 'angsuran']).optional(),
  status: z.enum(['pending', 'verified']).optional(),
})

export const Route = createFileRoute('/_auth/setoran')({
  validateSearch: (search) => depositSearchSchema.parse(search),
  component: SetoranPage,
})

function SetoranPage() {
  const search = Route.useSearch()

  const { data, isLoading, error } = useQuery({
    queryKey: ['deposit', search],
    queryFn: () => getDepositList(search),
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
        Terjadi kesalahan saat memuat data setoran.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <SetoranHeader />
      <SetoranFilters 
        currentFilters={search} 
        summary={data?.summary} 
      />
      <SetoranSearch currentSearch={search.search} />
      <SetoranTable 
        data={data?.deposits || []}
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
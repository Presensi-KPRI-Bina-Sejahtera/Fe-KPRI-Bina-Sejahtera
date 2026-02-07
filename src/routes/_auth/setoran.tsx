import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { getDepositList } from '@/services/depositService'
import { SetoranHeader } from '@/components/setoran/setoran-header'
import { SetoranFilters } from '@/components/setoran/setoran-filters'
import { SetoranSearch } from '@/components/setoran/setoran-search'
import { SetoranTable } from '@/components/setoran/setoran-table'
import LoadingPage from '@/components/loading-page'
import ErrorPage from '@/components/error-page'

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
    return <LoadingPage />
  }

  if (error) {
    return <ErrorPage page="setoran" />
  }

  return (
    <div className="flex flex-col gap-6">
      <SetoranHeader currentFilters={search} />
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
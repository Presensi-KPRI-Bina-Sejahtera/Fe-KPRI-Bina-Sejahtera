import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { getCashflowList } from '@/services/cashflowService'
import { KeuanganHeader } from '@/components/keuangan/keuangan-header'
import { KeuanganStats } from '@/components/keuangan/keuangan-stats'
import { KeuanganFilters } from '@/components/keuangan/keuangan-filters'
import { KeuanganTable } from '@/components/keuangan/keuangan-table'
import LoadingPage from '@/components/loading-page'
import ErrorPage from '@/components/error-page'

const cashflowSearchSchema = z.object({
  page: z.number().catch(1),
  per_page: z.number().catch(10),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  type: z.enum(['all', 'pemasukan', 'pengeluaran']).optional(),
  search: z.string().optional(),
})

export const Route = createFileRoute('/_auth/keuangan')({
  validateSearch: (search) => cashflowSearchSchema.parse(search),
  component: KeuanganPage,
})

function KeuanganPage() {
  const search = Route.useSearch()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['cashflow', search],
    queryFn: () => getCashflowList(search),
    placeholderData: (previousData) => previousData,
  })

  if (isLoading) {
    return <LoadingPage />
  }

  if (error) {
    return (
      <ErrorPage 
        title="Gagal Memuat Data Keuangan" 
        error={error} 
        reset={refetch} 
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <KeuanganHeader currentFilters={search} />
      <KeuanganStats summary={data?.summary} />
      <KeuanganFilters currentFilters={search} />
      <KeuanganTable
        data={data?.cashflows || []}
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
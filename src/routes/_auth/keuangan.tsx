import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { getCashflowList } from '@/services/cashflowService'
import { KeuanganHeader } from '@/components/keuangan/keuangan-header'
import { KeuanganStats } from '@/components/keuangan/keuangan-stats'
import { KeuanganFilters } from '@/components/keuangan/keuangan-filters'
import { KeuanganTable } from '@/components/keuangan/keuangan-table'

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

  const { data, isLoading, error } = useQuery({
    queryKey: ['cashflow', search],
    queryFn: () => getCashflowList(search),
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
        Terjadi kesalahan saat memuat data keuangan.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <KeuanganHeader />
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

import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { getTokoList } from '@/services/tokoService'
import { TokoHeader } from '@/components/toko/toko-header'
import { TokoSearch } from '@/components/toko/toko-search'
import { TokoTable } from '@/components/toko/toko-table'

const tokoSearchSchema = z.object({
  page: z.number().catch(1),
  per_page: z.number().catch(10),
  search: z.string().optional(),
})

export const Route = createFileRoute('/_auth/toko')({
  validateSearch: (search) => tokoSearchSchema.parse(search),
  component: TokoPage,
})

function TokoPage() {
  const search = Route.useSearch()

  const { data, isLoading, error } = useQuery({
    queryKey: ['toko', search],
    queryFn: () => getTokoList(search),
    placeholderData: (previousData) => previousData,
  })

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Gagal memuat data toko. Silakan coba lagi nanti.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <TokoHeader />
      <TokoSearch currentSearch={search.search} />
      <TokoTable 
        data={data?.presence_locations || []} 
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
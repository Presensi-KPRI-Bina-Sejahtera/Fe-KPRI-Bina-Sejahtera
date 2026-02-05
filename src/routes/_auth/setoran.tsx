import { createFileRoute } from '@tanstack/react-router'
import { SetoranHeader } from '@/components/setoran/setoran-header'
import { SetoranFilters } from '@/components/setoran/setoran-filters'
import { SetoranSearch } from '@/components/setoran/setoran-search'
import { SetoranTable } from '@/components/setoran/setoran-table'

export const Route = createFileRoute('/_auth/setoran')({
  component: SetoranPage,
})

function SetoranPage() {
  return (
    <div className="flex flex-col gap-6">
      <SetoranHeader />
      <SetoranFilters />
      <SetoranSearch />
      <SetoranTable />
    </div>
  )
}
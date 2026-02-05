import { createFileRoute } from '@tanstack/react-router'
import { TokoHeader } from '@/components/toko/toko-header'
import { TokoSearch } from '@/components/toko/toko-search'
import { TokoTable } from '@/components/toko/toko-table'

export const Route = createFileRoute('/_auth/toko')({
  component: TokoPage,
})

function TokoPage() {
  return (
    <div className="flex flex-col gap-6">
      <TokoHeader />
      <TokoSearch />
      <TokoTable />
    </div>
  )
}
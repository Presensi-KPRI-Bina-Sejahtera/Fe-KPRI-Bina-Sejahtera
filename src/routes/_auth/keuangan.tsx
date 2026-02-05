import { createFileRoute } from '@tanstack/react-router'
import { KeuanganHeader } from '@/components/keuangan/keuangan-header'
import { KeuanganStats } from '@/components/keuangan/keuangan-stats'
import { KeuanganFilters } from '@/components/keuangan/keuangan-filters'
import { KeuanganTable } from '@/components/keuangan/keuangan-table'

export const Route = createFileRoute('/_auth/keuangan')({
  component: KeuanganPage,
})

function KeuanganPage() {
  return (
    <div className="flex flex-col gap-6">
      <KeuanganHeader />
      <KeuanganStats />
      <KeuanganFilters />
      <KeuanganTable />
    </div>
  )
}
import { createFileRoute } from '@tanstack/react-router'
import { KehadiranHeader } from '@/components/kehadiran/kehadiran-header'
import { KehadiranFilters } from '@/components/kehadiran/kehadiran-filters'
import { KehadiranStats } from '@/components/kehadiran/kehadiran-stats'
import { KehadiranTable } from '@/components/kehadiran/kehadiran-table'

export const Route = createFileRoute('/_auth/kehadiran')({
  component: KehadiranPage,
})

function KehadiranPage() {
  return (
    <div className="flex flex-col gap-6">
      <KehadiranHeader />
      <KehadiranFilters />
      <KehadiranStats />
      <KehadiranTable />
    </div>
  )
}
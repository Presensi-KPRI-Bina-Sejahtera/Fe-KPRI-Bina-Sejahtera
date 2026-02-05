import { createFileRoute } from '@tanstack/react-router'
import { UsersHeader } from '@/components/users/users-header'
import { UsersFilters } from '@/components/users/users-filters'
import { UsersTable } from '@/components/users/users-table'

export const Route = createFileRoute('/_auth/users')({
  component: UsersPage,
})

function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <UsersHeader />
      <UsersFilters />
      <UsersTable />
    </div>
  )
}
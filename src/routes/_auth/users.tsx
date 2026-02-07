import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { getUserList } from '@/services/userService'
import { UsersHeader } from '@/components/users/users-header'
import { UsersFilters } from '@/components/users/users-filters'
import { UsersTable } from '@/components/users/users-table'

const usersSearchSchema = z.object({
  page: z.number().catch(1),
  per_page: z.number().catch(10),
  search: z.string().optional(),
  role: z.enum(['admin', 'employee']).optional(),
})

export const Route = createFileRoute('/_auth/users')({
  validateSearch: (search) => usersSearchSchema.parse(search),
  component: UsersPage,
})

function UsersPage() {
  const search = Route.useSearch()

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', search],
    queryFn: () => getUserList(search),
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
        Terjadi kesalahan saat memuat data user.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <UsersHeader />
      <UsersFilters currentFilters={search} />
      <UsersTable 
        data={data?.users || []} 
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
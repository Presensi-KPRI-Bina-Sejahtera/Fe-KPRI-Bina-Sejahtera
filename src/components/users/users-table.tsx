import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useNavigate } from "@tanstack/react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowUpDown, ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { UserDeleteDialog } from "./user-delete-dialog"
import { UserEditDialog } from "./user-edit-dialog"
import type { ColumnDef, SortingState } from "@tanstack/react-table"

import type { UserRecord } from "@/services/userService"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { deleteUser } from "@/services/userService"

interface UsersTableProps {
  data: Array<UserRecord>
  pagination: {
    pageIndex: number
    pageSize: number
    pageCount: number
    total: number
  }
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function UsersTable({ data, pagination }: UsersTableProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [sorting, setSorting] = React.useState<SortingState>([])

  const [userToDelete, setUserToDelete] = React.useState<UserRecord | null>(null)
  const [userToEdit, setUserToEdit] = React.useState<UserRecord | null>(null)

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      toast.success("User berhasil dihapus")
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setUserToDelete(null)
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Gagal menghapus user"
      toast.error(errorMessage)
    },
  })

  const handlePageChange = (newPageIndex: number) => {
    navigate({
      to: '/users',
      search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
      replace: true,
    })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      to: '/users',
      search: (prev: any) => ({ ...prev, per_page: newPageSize, page: 1 }),
      replace: true,
    })
  }

  const columns: Array<ColumnDef<UserRecord>> = [
    {
      id: "index",
      header: "No.",
      cell: ({ row, table }) => {
        const index = row.index + 1 + (table.getState().pagination.pageIndex * table.getState().pagination.pageSize)
        return <span className="text-muted-foreground font-medium">{index}.</span>
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent font-bold text-slate-900 justify-start"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Karyawan
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-slate-200">
            <AvatarImage src={row.original.profile_image || ""} />
            <AvatarFallback className="bg-orange-100 text-orange-600 font-medium">
              {row.original.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-left">
            <span className="font-semibold text-slate-900 text-sm">{row.original.name}</span>
            <span className="text-xs text-muted-foreground">@{row.original.username}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span className="font-medium text-slate-700">{row.original.email}</span>,
    },
    {
      accessorKey: "presence_location_name",
      header: "Toko",
      cell: ({ row }) => <span className="font-medium text-slate-700">{row.original.presence_location_name || "-"}</span>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const isAdmin = row.original.role === "admin"
        return (
          <Badge 
            variant="outline" 
            className={`px-3 py-0.5 rounded-full border ${
              isAdmin 
                ? "bg-rose-50 text-rose-600 border-rose-200" 
                : "bg-amber-50 text-amber-600 border-amber-200"
            }`}
          >
            {capitalize(row.original.role)}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50"
            onClick={() => setUserToEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
            onClick={() => setUserToDelete(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { sorting },
    manualPagination: true,
    pageCount: pagination.pageCount,
  })

  const { pageIndex } = pagination
  const { pageCount } = pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    if (pageCount <= maxVisible) {
      for (let i = 0; i < pageCount; i++) pages.push(i)
    } else {
      if (pageIndex < 3) {
        for (let i = 0; i < 4; i++) pages.push(i)
        pages.push(-1)
        pages.push(pageCount - 1)
      } else if (pageIndex > pageCount - 4) {
        pages.push(0)
        pages.push(-1)
        for (let i = pageCount - 4; i < pageCount; i++) pages.push(i)
      } else {
        pages.push(0)
        pages.push(-1)
        pages.push(pageIndex - 1)
        pages.push(pageIndex)
        pages.push(pageIndex + 1)
        pages.push(-1)
        pages.push(pageCount - 1)
      }
    }
    return pages
  }

  return (
    <>
      <Card className="shadow-lg border-3 border-slate-200 p-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header, index) => {
                    let alignClass = "text-center"
                    if (index === 1) alignClass = "text-left"
                    return (
                      <TableHead key={header.id} className={`font-semibold text-slate-900 ${alignClass}`}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50">
                    {row.getVisibleCells().map((cell, index) => {
                      let alignClass = "text-center"
                      if (index === 1) alignClass = "text-left"
                      return (
                        <TableCell key={cell.id} className={`py-3 ${alignClass}`}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Tidak ada user ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-center p-4 border-t">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
              <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handlePageChange(pageIndex - 1)} disabled={pageIndex <= 0}>
                      <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {getPageNumbers().map((idx, i) => (
                    idx === -1 ? (
                      <span key={`dots-${i}`} className="px-2 text-muted-foreground">...</span>
                    ) : (
                      <Button
                        key={idx}
                        variant={pageIndex === idx ? "secondary" : "ghost"}
                        size="sm"
                        className={`h-8 w-8 font-bold ${pageIndex === idx ? "text-slate-900" : "text-muted-foreground"}`}
                        onClick={() => handlePageChange(idx)}
                      >
                        {idx + 1}
                      </Button>
                    )
                  ))}
                  <Button variant="ghost" size="icon" onClick={() => handlePageChange(pageIndex + 1)} disabled={pageIndex >= pageCount - 1}>
                      <ChevronRight className="h-4 w-4" />
                  </Button>
              </div>

              <Select
                  value={`${pagination.pageSize}`}
                  onValueChange={(value) => handlePageSizeChange(Number(value))}
              >
                  <SelectTrigger className="h-8 md:w-27.5 w-auto bg-slate-100 border-none">
                      <SelectValue placeholder={`${pagination.pageSize} / Page`} />
                  </SelectTrigger>
                  <SelectContent side="top">
                      {[10, 20, 30, 40, 50].map((pageSize) => (
                          <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize} / Page
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <UserEditDialog 
        open={!!userToEdit}
        onOpenChange={(isOpen) => !isOpen && setUserToEdit(null)}
        user={userToEdit}
      />

      <UserDeleteDialog 
        open={!!userToDelete} 
        onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}
        user={userToDelete}
        onConfirm={(id) => deleteMutation.mutate(id)}
        isDeleting={deleteMutation.isPending}
      />
    </>
  )
}
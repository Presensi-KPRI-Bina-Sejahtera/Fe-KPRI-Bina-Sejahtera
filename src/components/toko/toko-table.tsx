import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useNavigate } from "@tanstack/react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowUpDown, ChevronLeft, ChevronRight, MapPin, Pencil, Store, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { TokoEditDialog } from "./toko-edit-dialog"
import { TokoDeleteDialog } from "./toko-delete-dialog"
import type { ColumnDef, SortingState } from "@tanstack/react-table"

import type { TokoRecord} from "@/services/tokoService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { deleteToko } from "@/services/tokoService"

interface TokoTableProps {
  data: Array<TokoRecord>
  pagination: {
    pageIndex: number
    pageSize: number
    pageCount: number
    total: number
  }
}

export function TokoTable({ data, pagination }: TokoTableProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [tokoToEdit, setTokoToEdit] = React.useState<TokoRecord | null>(null)
  const [tokoToDelete, setTokoToDelete] = React.useState<TokoRecord | null>(null)
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteToko(id),
    onSuccess: () => {
      toast.success("Toko berhasil dihapus")
      queryClient.invalidateQueries({ queryKey: ["toko"] })
      setTokoToDelete(null)
    },
    onError: (error: any) => {
      console.error(error)
      toast.error("Gagal menghapus toko")
    },
  })

  const handlePageChange = (newPageIndex: number) => {
    navigate({
      to: '/toko',
      search: (prev: any) => ({ ...prev, page: newPageIndex + 1 }),
      replace: true,
    })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    navigate({
      to: '/toko',
      search: (prev: any) => ({ ...prev, per_page: newPageSize, page: 1 }),
      replace: true,
    })
  }

  const columns: Array<ColumnDef<TokoRecord>> = [
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
          Nama Toko
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-start gap-3">
          <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center border border-slate-200">
            <Store className="h-4 w-4 text-slate-600" />
          </div>
          <span className="font-semibold text-slate-900 text-sm">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Alamat",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-700 block max-w-[250px] truncate" title={row.original.address}>
          {row.original.address || "-"}
        </span>
      ),
    },
    {
      accessorKey: "latitude",
      header: "Latitude",
      cell: ({ row }) => (
        <span className="text-sm font-mono text-slate-700 font-medium">{row.original.latitude}</span>
      ),
    },
    {
      accessorKey: "longitude",
      header: "Longitude",
      cell: ({ row }) => (
        <span className="text-sm font-mono text-slate-700 font-medium">{row.original.longitude}</span>
      ),
    },
    {
      accessorKey: "max_distance",
      header: "Jarak Presensi",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-600">
            {row.original.max_distance} Meter
        </span>
      ),
    },
    {
      id: "maps",
      header: "Maps",
      cell: ({ row }) => (
        row.original.maps ? (
          <Button 
            size="sm" 
            className="bg-blue-500 hover:bg-blue-600 text-white gap-1.5 h-8 px-3"
            onClick={() => window.open(row.original.maps, '_blank')}
          >
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-xs">Buka Map</span>
          </Button>
        ) : (
            <span className="text-muted-foreground text-xs">-</span>
        )
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                onClick={() => setTokoToEdit(row.original)}
            >
                <Pencil className="h-4 w-4" />
            </Button>

            <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                onClick={() => setTokoToDelete(row.original)}
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
                        const isTextLeft = header.id === 'name' || header.id === 'address'
                        return (
                            <TableHead 
                                key={header.id} 
                                className={`font-semibold text-slate-900 whitespace-nowrap ${isTextLeft ? 'text-left' : 'text-center'}`}
                            >
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
                            const isTextLeft = cell.column.id === 'name' || cell.column.id === 'address'
                            return (
                                <TableCell key={cell.id} className={`py-3 ${isTextLeft ? 'text-left' : 'text-center'}`}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            )
                        })}
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            Tidak ada data toko ditemukan.
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

        <TokoEditDialog 
            open={!!tokoToEdit}
            onOpenChange={(isOpen) => !isOpen && setTokoToEdit(null)}
            toko={tokoToEdit}
        />

        <TokoDeleteDialog 
            open={!!tokoToDelete}
            onOpenChange={(isOpen) => !isOpen && setTokoToDelete(null)}
            toko={tokoToDelete}
            onConfirm={(id) => deleteMutation.mutate(id)}
            isDeleting={deleteMutation.isPending}
        />
    </>
  )
}
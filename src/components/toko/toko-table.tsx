"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronLeft, ChevronRight, MapPin, Pencil, Store, Trash2 } from "lucide-react"
import { TokoEditDialog } from "./toko-edit-dialog"
import { TokoDeleteDialog } from "./toko-delete-dialog"
import type {
  ColumnDef,
  SortingState} from "@tanstack/react-table";

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


type TokoRecord = {
  id: string
  name: string
  location: string
  latitude: string
  longitude: string
  radius: string
}

const data: Array<TokoRecord> = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 1}`,
  name: "Cabang Pasar Baru",
  location: "Jl. Jendral Sudirman No. 1, Jakarta Pusat",
  latitude: "-6.200000",
  longitude: "106.816666",
  radius: "50 Meter",
}))

const columns: Array<ColumnDef<TokoRecord>> = [
  {
    id: "index",
    header: "No.",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-medium">
        {row.index + 1}.
      </span>
    ),
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
      <div className="flex items-center justify-center gap-3">
        <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center border border-slate-200">
          <Store className="h-4 w-4 text-slate-600" />
        </div>
        <span className="font-semibold text-slate-900 text-sm">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: "Lokasi",
    cell: ({ row }) => (
      <span className="text-sm font-mono text-slate-700 font-medium" title={row.original.location}>
        {row.original.location}
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
    accessorKey: "radius",
    header: "Jarak Presensi",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-slate-600">{row.original.radius}</span>
    ),
  },
  {
    id: "maps",
    header: "Maps",
    cell: () => (
      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white gap-1.5 h-8 px-3">
        <MapPin className="h-3.5 w-3.5" />
        <span className="text-xs">Buka Map</span>
      </Button>
    ),
  },
{
    id: "actions",
    header: "Action",
    cell: () => (
      <div className="flex items-center gap-2">
        <TokoEditDialog />
        <TokoDeleteDialog />
      </div>
    ),
  },
]

export function TokoTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
        pagination: {
            pageSize: 10
        }
    }
  })

  const pageIndex = table.getState().pagination.pageIndex
  const pageCount = table.getPageCount()
  
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
    <Card className="shadow-lg border-3 border-slate-200 p-0">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold text-slate-900 whitespace-nowrap text-center">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-slate-50">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3 text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-center p-4 border-t">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
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
                      onClick={() => table.setPageIndex(idx)}
                    >
                      {idx + 1}
                    </Button>
                  )
                ))}

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
            >
                <SelectTrigger className="h-8 md:w-27.5 w-auto bg-slate-100 border-none">
                    <SelectValue placeholder={`${table.getState().pagination.pageSize} / Page`} />
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
  )
}
import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
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

type AttendanceRecord = {
  id: string
  name: string
  username: string
  avatar: string
  date: string
  checkIn: string
  checkOut: string
  totalHours: string
}

const data: Array<AttendanceRecord> = Array.from({ length: 150 }, (_, i) => ({
  id: `${i + 1}`,
  name: i % 2 === 0 ? "Alice Smith" : "Bob Johnson",
  username: i % 2 === 0 ? "@alicesmith" : "@bobjohnson",
  avatar: i % 2 === 0 ? "/avatars/alice.jpg" : "/avatars/bob.jpg",
  date: "2023-10-25",
  checkIn: "08:00",
  checkOut: "17:00",
  totalHours: i % 3 === 0 ? "8 Jam 50 Menit" : "9 Jam",
}))

const columns: Array<ColumnDef<AttendanceRecord>> = [
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
        Karyawan
        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 border border-slate-200">
          <AvatarImage src={row.original.avatar} />
          <AvatarFallback className="bg-orange-100 text-orange-600 font-medium">
            {row.original.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 text-sm">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">{row.original.username}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2 font-medium text-slate-700">
        <Calendar className="h-4 w-4 text-slate-800" />
        {row.original.date}
      </div>
    ),
  },
  {
    accessorKey: "checkIn",
    header: "Jam Masuk",
    cell: ({ row }) => (
      <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs border border-emerald-100">
        {row.original.checkIn}
      </span>
    ),
  },
  {
    accessorKey: "checkOut",
    header: "Jam Pulang",
    cell: ({ row }) => (
      <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded text-xs border border-rose-100">
        {row.original.checkOut}
      </span>
    ),
  },
  {
    accessorKey: "totalHours",
    header: "Total Jam Kerja",
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-50">
        {row.original.totalHours}
      </Badge>
    ),
  },
]

export function KehadiranTable() {
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
    <Card className="shadow-lg border-slate-200 border-3">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header, index) => {
                  let alignClass = "text-center"
                  if (index === 1) alignClass = "text-left"

                  return (
                    <TableHead 
                      key={header.id} 
                      className={`font-semibold text-slate-900 ${alignClass}`}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-slate-50 border-b border-slate-100">
                {row.getVisibleCells().map((cell, index) => {
                  let alignClass = "text-center"
                  if (index === 1) alignClass = "text-left"

                  return (
                    <TableCell key={cell.id} className={`py-4 ${alignClass}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )
                })}
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
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
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
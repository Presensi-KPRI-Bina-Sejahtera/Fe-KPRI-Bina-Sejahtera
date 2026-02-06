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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SetoranRecord = {
  id: string
  name: string
  avatar: string
  date: string
  inputBy: { name: string; avatar: string }
  type: "Simpanan" | "Angsuran"
  amount: number
  verificationCode: string | null
}

const data: Array<SetoranRecord> = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 1}`,
  name: i % 2 === 0 ? "Alice Smith" : "Bob Johnson",
  avatar: i % 2 === 0 ? "/avatars/alice.jpg" : "/avatars/bob.jpg",
  date: "2023-10-25",
  inputBy: {
    name: i % 3 === 0 ? "Admin" : "Teller",
    avatar: "/avatars/default.jpg",
  },
  type: i % 3 === 0 ? "Angsuran" : "Simpanan",
  amount: 500000,
  verificationCode: i % 2 === 0 ? "VER-001" : null,
}))

const formatRp = (val: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val)
}

const columns: Array<ColumnDef<SetoranRecord>> = [
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
        Nama Anggota
        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 border border-slate-200">
          <AvatarImage src={row.original.avatar} />
          <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">
            {row.original.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="font-semibold text-slate-900 text-sm">{row.original.name}</span>
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
    accessorKey: "inputBy",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 hover:bg-transparent font-bold text-slate-900 justify-start"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Penginput
        <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 border border-slate-200">
          <AvatarImage src={row.original.inputBy.avatar} />
          <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">
            {row.original.inputBy.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-left">
          <span className="font-semibold text-slate-900 text-sm">{row.original.inputBy.name}</span>
          <span className="text-xs text-muted-foreground">@{row.original.inputBy.name.toLowerCase().replace(' ', '')}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipe",
    cell: ({ row }) => {
      const isSimpanan = row.original.type === "Simpanan"
      return (
        <Badge 
          variant="outline" 
          className={`px-3 py-0.5 rounded-full border ${
            isSimpanan 
              ? "bg-blue-50 text-blue-600 border-blue-200" 
              : "bg-purple-50 text-purple-600 border-purple-200"
          }`}
        >
          {row.original.type}
        </Badge>
      )
    },
  },
  {
    accessorKey: "amount",
    header: "Jumlah",
    cell: ({ row }) => (
      <span className="font-bold text-emerald-600">
        {formatRp(row.original.amount)}
      </span>
    ),
  },
  {
    accessorKey: "verificationCode",
    header: "Kode Verifikasi",
    cell: ({ row }) => {
      const code = row.original.verificationCode
      if (code) {
        return (
          <div className="w-full max-w-[120px] bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono py-1.5 px-3 rounded text-center mx-auto">
            {code}
          </div>
        )
      }
      return (
        <Input 
          placeholder="Input Kode" 
          className="h-8 text-xs bg-white max-w-32"
        />
      )
    },
  },
]

export function SetoranTable() {
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header, index) => {
                  let alignClass = "text-center"
                  if (index === 1 || index === 3) alignClass = "text-left"

                  return (
                    <TableHead key={header.id} className={`font-semibold text-slate-900 ${alignClass}`}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-slate-50">
                {row.getVisibleCells().map((cell, index) => {
                  let alignClass = "text-center"
                  if (index === 1 || index === 3) alignClass = "text-left"

                  return (
                    <TableCell key={cell.id} className={`py-3 ${alignClass}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>

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
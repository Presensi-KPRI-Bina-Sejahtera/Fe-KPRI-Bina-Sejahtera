import { Calendar, Search, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function KehadiranFilters() {
  return (
    <Card className="border-3 border-slate-200 shadow-lg">
      <CardContent className="px-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Tanggal Mulai</Label>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="date" className="pl-9" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Tanggal Selesai</Label>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="date" className="pl-9" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Filter Pegawai</Label>
          <Select>
            <SelectTrigger className="pl-9 relative w-full">
              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Semua Pegawai" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Pegawai</SelectItem>
              <SelectItem value="it">IT Dept</SelectItem>
              <SelectItem value="hr">HR Dept</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Cari Data</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari nama..." className="pl-9" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
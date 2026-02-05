import { Filter, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function UsersFilters() {
  return (
    <Card className="p-0 border-3 border-slate-200 shadow-lg">
      <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span className="font-bold">Filter Role:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Checkbox id="role-admin" checked/>
            <Label htmlFor="role-admin" className="font-bold cursor-pointer">Admin</Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Checkbox id="role-pegawai" checked/>
            <Label htmlFor="role-pegawai" className="font-bold cursor-pointer">Pegawai</Label>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari nama..." className="pl-9" />
        </div>
      </CardContent>
    </Card>
  )
}
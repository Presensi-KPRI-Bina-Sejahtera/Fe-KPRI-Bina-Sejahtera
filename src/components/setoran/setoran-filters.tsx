import { Calendar, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function SetoranFilters() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 shadow-lg border-3 border-slate-200">
        <CardContent className="px-6 flex flex-col justify-between h-full gap-6">
          
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Rentang Tanggal</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-full">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="date" className="pl-10" />
              </div>
              <span className="text-muted-foreground">-</span>
              <div className="relative w-full">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="date" className="pl-10" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-6 md:gap-12 pt-2 border-t border-dashed">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">Jenis :</span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="simpanan" defaultChecked />
                <Label htmlFor="simpanan" className="cursor-pointer font-bold">Simpanan</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="angsuran" defaultChecked />
                <Label htmlFor="angsuran" className="cursor-pointer font-bold">Angsuran</Label>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">Status :</span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="verified" defaultChecked />
                <Label htmlFor="verified" className="cursor-pointer font-bold">Terverifikasi</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="pending" defaultChecked />
                <Label htmlFor="pending" className="cursor-pointer font-bold">Belum</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 text-white border-slate-800 shadow-lg">
        <CardContent className="px-6 flex flex-col justify-center h-full gap-4">
          <h3 className="text-slate-300 font-medium border-b border-slate-700 pb-2">
            Total Berdasarkan Filter
          </h3>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Simpanan</span>
            <span className="text-emerald-400 font-bold text-lg">Rp 1.700.000</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Angsuran</span>
            <span className="text-blue-400 font-bold text-lg">Rp 2.750.000</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
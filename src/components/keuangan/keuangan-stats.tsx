import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function KeuanganStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-lg border-slate-200 border-3">
        <CardContent className="px-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-md font-medium text-muted-foreground">Total Pemasukan</p>
            <h3 className="text-2xl font-bold text-slate-900">Rp 7.500.000</h3>
            <p className="text-md text-emerald-600 flex items-center gap-1 font-medium">
              <ArrowUpRight className="size-5" />
              Berdasarkan Filter
            </p>
          </div>
          <div className="size-14 rounded-full bg-emerald-50 flex items-center justify-center">
            <ArrowUpRight className="size-8 text-emerald-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-slate-200 border-3">
        <CardContent className="px-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-md font-medium text-muted-foreground">Total Pengeluaran</p>
            <h3 className="text-2xl font-bold text-slate-900">Rp 1.400.000</h3>
            <p className="text-md text-rose-600 flex items-center gap-1 font-medium">
              <ArrowDownRight className="size-5" />
              Berdasarkan Filter
            </p>
          </div>
          <div className="size-14 rounded-full bg-rose-50 flex items-center justify-center">
            <ArrowDownRight className="size-8 text-rose-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
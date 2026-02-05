import { Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function KehadiranStats() {
  return (
    <Card className="bg-slate-900 text-white border-slate-800 shadow-lg">
      <CardContent className="px-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-300">
            Rata-rata Jam Kerja Per-orang
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">69.69</span>
            <span className="text-sm text-slate-400">Jam</span>
          </div>
          <p className="text-xs text-slate-500">
            Berdasarkan filter saat ini
          </p>
        </div>
        <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
          <Clock className="h-5 w-5 text-slate-300" />
        </div>
      </CardContent>
    </Card>
  )
}
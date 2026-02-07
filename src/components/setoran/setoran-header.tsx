import { FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SetoranHeader() {
  return (
    <div className="flex md:items-center items-start justify-between pt-4 flex-col sm:flex-row gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Manajemen Setoran</h1>
        <p className="text-lg text-muted-foreground">
          Kelola simpanan dan angsuran anggota koperasi
        </p>
      </div>
      <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 h-12">
        <FileSpreadsheet className="h-4 w-4" />
        Export Excel
      </Button>
    </div>
  )
}
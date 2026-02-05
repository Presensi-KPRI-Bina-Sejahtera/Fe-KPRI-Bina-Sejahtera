import { FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SetoranHeader() {
  return (
    <div className="flex items-center justify-between pt-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Manajemen Setoran</h1>
        <p className="text-md text-muted-foreground">
          Kelola simpanan dan angsuran anggota koperasi
        </p>
      </div>
      <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
        <FileSpreadsheet className="h-4 w-4" />
        Export Excel
      </Button>
    </div>
  )
}
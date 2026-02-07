import { useState } from "react"
import { FileSpreadsheet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { exportCashflowExcel, CashflowParams } from "@/services/cashflowService"

interface KeuanganHeaderProps {
  currentFilters: CashflowParams
}

export function KeuanganHeader({ currentFilters }: KeuanganHeaderProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const blob = await exportCashflowExcel(currentFilters)
      
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      
      const filename = `Laporan_Keuangan_${new Date().toISOString().split('T')[0]}.xlsx`
      link.setAttribute('download', filename)
      
      document.body.appendChild(link)
      link.click()
      
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success("Export Excel berhasil diunduh")
    } catch (error) {
      console.error("Export failed", error)
      toast.error("Gagal mengunduh file Excel")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex md:items-center items-start justify-between pt-4 flex-col sm:flex-row gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Manajemen Pemasukan dan Pengeluaran</h1>
        <p className="text-lg text-muted-foreground">
          Rekapitulasi keuangan harian toko
        </p>
      </div>
      <Button 
        className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 h-12"
        onClick={handleExport}
        disabled={isExporting}
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="h-4 w-4" />
        )}
        {isExporting ? "Mengunduh..." : "Export Excel"}
      </Button>
    </div>
  )
}
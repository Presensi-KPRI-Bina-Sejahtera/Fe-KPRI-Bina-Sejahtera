import { FileSpreadsheet } from "lucide-react";
import { Button } from "../ui/button";

export function KehadiranHeader() {
  return (
    <div className="flex md:items-center items-start justify-between pt-4 flex-col sm:flex-row gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Manajemen Kehadiran</h1>
        <p className="text-lg text-muted-foreground">
        Pantau kehadiran dan total jam kerja karyawan
        </p>
      </div>
      <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 h-12">
        <FileSpreadsheet className="h-4 w-4" />
        Export Excel
      </Button>
    </div>
  )
}
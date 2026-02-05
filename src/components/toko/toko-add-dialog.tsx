import { useState } from "react"
import { MapPin, Plus } from "lucide-react"
import { MapPicker } from "./map-picker"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function TokoAddDialog() {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ lat: -6.200000, lng: 106.816666 })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 shadow-lg">
          <Plus className="h-4 w-4" />
          Tambah Toko
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Tambah Toko Baru</DialogTitle>
          <DialogDescription className="text-md">
            Silakan masukkan data toko baru
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-bold text-slate-700">Nama Toko</Label>
            <Input id="name" placeholder="Contoh: Toko Cabang Utara" className="bg-slate-50" />
          </div>

          <div className="space-y-4 rounded-lg border p-4 bg-slate-50/50">
            <div className="flex items-center gap-2 text-rose-500 font-medium">
              <MapPin className="size-5" />
              <span className="text-slate-900">Lokasi Toko</span>
            </div>
            
            <MapPicker 
              lat={coords.lat} 
              lng={coords.lng} 
              onLocationSelect={(lat, lng) => setCoords({ lat, lng })} 
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-600">Latitude</Label>
                <Input placeholder="0.000000" readOnly className="bg-white font-mono text-xs" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600">Longitude</Label>
                <Input placeholder="0.000000" readOnly className="bg-white font-mono text-xs" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600">Alamat</Label>
              <Input placeholder="Jl. Jendral Sudirman..." className="bg-white" />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600">Jarak maksimal (m) untuk presensi</Label>
              <Input type="number" defaultValue={50} className="bg-white" />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="destructive" className="w-[50%]" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button className="w-[50%] bg-slate-900 text-white hover:bg-slate-800">
            Tambah Toko
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
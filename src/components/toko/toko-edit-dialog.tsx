import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, MapPin } from "lucide-react"
import { toast } from "sonner"
import { MapPicker } from "./map-picker"
import type { TokoRecord} from "@/services/tokoService";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getAddressFromCoordinates, updateToko } from "@/services/tokoService"

interface TokoEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  toko: TokoRecord | null
}

export function TokoEditDialog({ open, onOpenChange, toko }: TokoEditDialogProps) {
  const queryClient = useQueryClient()
  
  const [coords, setCoords] = useState({ lat: -6.200000, lng: 106.816666 })
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [maxDistance, setMaxDistance] = useState(50)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)

  useEffect(() => {
    if (toko) {
      setName(toko.name)
      setAddress(toko.address)
      setMaxDistance(toko.max_distance)
      setCoords({
        lat: parseFloat(toko.latitude),
        lng: parseFloat(toko.longitude)
      })
    }
  }, [toko])

  const mutation = useMutation({
    mutationFn: (data: any) => updateToko(toko!.id, data),
    onSuccess: () => {
      toast.success("Toko berhasil diperbarui")
      queryClient.invalidateQueries({ queryKey: ["toko"] })
      onOpenChange(false)
    },
    onError: (error: any) => {
      console.error(error)
      toast.error("Gagal memperbarui toko")
    }
  })

  const handleLocationSelect = async (lat: number, lng: number) => {
    setCoords({ lat, lng })
    setIsLoadingAddress(true)
    try {
      const fetchedAddress = await getAddressFromCoordinates(lat, lng)
      if (fetchedAddress) {
        setAddress(fetchedAddress)
      }
    } catch (error) {
      console.error("Failed to get address", error)
    } finally {
      setIsLoadingAddress(false)
    }
  }

  const handleSubmit = () => {
    if (!toko) return
    if (!name || !address) {
      toast.error("Nama toko dan alamat harus diisi")
      return
    }

    mutation.mutate({
      name,
      address,
      latitude: coords.lat,
      longitude: coords.lng,
      max_distance: maxDistance
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Toko</DialogTitle>
          <DialogDescription className="text-md">
            Ubah detail lokasi toko
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="font-bold text-slate-700">Nama Toko</Label>
            <Input 
              id="edit-name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-50" 
            />
          </div>

          <div className="space-y-4 rounded-lg border p-4 bg-slate-50/50">
            <div className="flex items-center gap-2 text-rose-500 font-medium">
              <MapPin className="size-5" />
              <span className="text-slate-900">Lokasi Toko</span>
            </div>
            
            <MapPicker 
              lat={coords.lat} 
              lng={coords.lng} 
              onLocationSelect={handleLocationSelect} 
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-600">Latitude</Label>
                <Input 
                  value={coords.lat} 
                  readOnly 
                  className="bg-white font-mono text-xs text-slate-500" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600">Longitude</Label>
                <Input 
                  value={coords.lng} 
                  readOnly 
                  className="bg-white font-mono text-xs text-slate-500" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-slate-600">Alamat</Label>
                {isLoadingAddress && <span className="text-xs text-blue-500 animate-pulse">Mengambil alamat...</span>}
              </div>
              <Input 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-white" 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600">Jarak maksimal (m) untuk presensi</Label>
              <Input 
                type="number" 
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="bg-white" 
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="destructive" 
            className="md:w-[50%] w-full h-12" 
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Batal
          </Button>
          <Button 
            className="md:w-[50%] w-full bg-slate-900 text-white hover:bg-slate-800 h-12"
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
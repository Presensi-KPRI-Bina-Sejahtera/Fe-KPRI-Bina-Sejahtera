import { useEffect, useState } from "react"
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default marker icon in Leaflet + React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapPickerProps {
  lat: number
  lng: number
  onLocationSelect: (lat: number, lng: number) => void
}

function LocationMarker({ lat, lng, onSelect }: { lat: number, lng: number, onSelect: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  return <Marker position={[lat, lng]} />
}

export function MapPicker({ lat, lng, onLocationSelect }: MapPickerProps) {
  // Ensure map only renders on client
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [])

  if (!isMounted) return <div className="h-[200px] w-full bg-slate-100 animate-pulse rounded-md" />

  return (
    <div className="space-y-3">
      {/* Search Bar Facade */}
      <div className="flex gap-2">
        <Input placeholder="Cari alamat (Contoh: Pasar Tanah Abang)..." />
        <Button className="bg-blue-500 hover:bg-blue-600 text-white gap-2">
          <Search className="h-4 w-4" />
          Cari
        </Button>
      </div>

      {/* The Map */}
      <div className="h-[200px] w-full rounded-md overflow-hidden border border-slate-200 relative z-0">
        <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker lat={lat} lng={lng} onSelect={onLocationSelect} />
        </MapContainer>
      </div>
    </div>
  )
}
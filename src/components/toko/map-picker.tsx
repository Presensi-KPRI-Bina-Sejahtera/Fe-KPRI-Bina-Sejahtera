import { useEffect, useState } from 'react'
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapPickerProps {
  lat: number
  lng: number
  onLocationSelect: (lat: number, lng: number) => void
}

function LocationMarker({
  lat,
  lng,
  onSelect,
}: {
  lat: number
  lng: number
  onSelect: (lat: number, lng: number) => void
}) {
  const map = useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  return <Marker position={[lat, lng]} />
}

function FlyToLocation({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 15, { animate: true })
    }
  }, [lat, lng, map])

  return null
}

export function MapPicker({ lat, lng, onLocationSelect }: MapPickerProps) {
  const [isMounted, setIsMounted] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => setIsMounted(true), [])

  const handleSearch = async () => {
    if (!searchQuery) return
    setIsSearching(true)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const firstResult = data[0]
        const newLat = parseFloat(firstResult.lat)
        const newLng = parseFloat(firstResult.lon)
        onLocationSelect(newLat, newLng)
        toast.success(
          `Lokasi ditemukan: ${firstResult.display_name.split(',')[0]}`,
        )
      } else {
        toast.error('Lokasi tidak ditemukan')
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Gagal mencari lokasi')
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  if (!isMounted)
    return (
      <div className="h-[250px] w-full bg-slate-100 animate-pulse rounded-md" />
    )

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Cari lokasi (Contoh: Monas Jakarta)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSearching}
        />
        <Button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white gap-2"
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Cari
        </Button>
      </div>

      <div className="h-[250px] w-full rounded-md overflow-hidden border border-slate-200 relative z-0">
        <MapContainer
          center={[lat, lng]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationMarker lat={lat} lng={lng} onSelect={onLocationSelect} />
          <FlyToLocation lat={lat} lng={lng} />
        </MapContainer>
      </div>
    </div>
  )
}

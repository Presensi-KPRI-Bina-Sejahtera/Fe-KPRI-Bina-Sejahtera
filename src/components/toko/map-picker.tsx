import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import { Search, Loader2, AlertCircle } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

interface MapPickerProps {
  lat: number
  lng: number
  onLocationSelect: (lat: number, lng: number) => void
}

type NominatimSearchResult = {
  place_id?: number
  display_name?: string
  lat: string
  lon: string
}

function LocationMarker({ 
  lat, 
  lng, 
  onLocationSelect 
}: MapPickerProps) {
  const map = useMap()
  
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom())
  }, [lat, lng, map])

  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })

  return <Marker position={[lat, lng]} />
}

export function MapPicker({ lat, lng, onLocationSelect }: MapPickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [suggestions, setSuggestions] = useState<NominatimSearchResult[]>([])
  const [isSuggesting, setIsSuggesting] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestAbortRef = useRef<AbortController | null>(null)
  const suggestTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const selectSuggestion = (result: NominatimSearchResult) => {
    const newLat = parseFloat(result.lat)
    const newLng = parseFloat(result.lon)
    if (Number.isNaN(newLat) || Number.isNaN(newLng)) return

    setSearchQuery(result.display_name ?? searchQuery)
    setSuggestions([])
    setShowSuggestions(false)
    onLocationSelect(newLat, newLng)
  }

  useEffect(() => {
    const query = searchQuery.trim()

    if (suggestTimerRef.current) {
      clearTimeout(suggestTimerRef.current)
      suggestTimerRef.current = null
    }

    if (query.length < 3) {
      suggestAbortRef.current?.abort()
      setIsSuggesting(false)
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    suggestTimerRef.current = setTimeout(async () => {
      suggestAbortRef.current?.abort()
      const controller = new AbortController()
      suggestAbortRef.current = controller
      setIsSuggesting(true)

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`,
          {
            signal: controller.signal,
            headers: {
              'Accept-Language': 'id',
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch suggestions')
        }

        const data = (await response.json()) as unknown
        const results = Array.isArray(data) ? (data as NominatimSearchResult[]) : []

        setSuggestions(results)
        setShowSuggestions(results.length > 0)
      } catch (error) {
        if ((error as { name?: string })?.name === 'AbortError') return
        setSuggestions([])
        setShowSuggestions(false)
      } finally {
        setIsSuggesting(false)
      }
    }, 350)

    return () => {
      if (suggestTimerRef.current) {
        clearTimeout(suggestTimerRef.current)
        suggestTimerRef.current = null
      }
    }
  }, [searchQuery])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchError('')
    setShowSuggestions(false)
    setSuggestions([])

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const result = data[0]
        const newLat = parseFloat(result.lat)
        const newLng = parseFloat(result.lon)
        onLocationSelect(newLat, newLng)
      } else {
        setSearchError('Lokasi tidak ditemukan. Coba kata kunci lain.')
      }
    } catch (error) {
      setSearchError('Gagal mencari lokasi. Periksa koneksi internet.')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col gap-2">
        <form onSubmit={handleSearch} className="flex w-full gap-2">
          <Input 
            className="bg-white border-slate-300 focus:bg-white"
            placeholder="Cari lokasi (contoh: Malioboro, Yogyakarta)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (searchError) setSearchError('')
            }}
            onBlur={() => {
              // Delay so click on suggestion still registers
              setTimeout(() => setShowSuggestions(false), 150)
            }}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true)
            }}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isSearching}
            className="bg-slate-900 text-white hover:bg-slate-800 shrink-0"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            {suggestions.map((result, index) => (
              <button
                key={result.place_id ?? `${result.display_name ?? 'result'}-${index}`}
                type="button"
                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(result)}
              >
                {result.display_name ?? 'Lokasi'}
              </button>
            ))}
          </div>
        )}

        {isSuggesting && !isSearching && searchQuery.trim().length >= 3 && suggestions.length === 0 && (
          <div className="text-xs text-slate-500 px-1">Mencari saran...</div>
        )}
        
        {searchError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-md shadow-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span>{searchError}</span>
          </div>
        )}
      </div>

      <div className="h-[300px] w-full rounded-md overflow-hidden border border-slate-200 shadow-sm relative z-0">
        <MapContainer
          center={[lat, lng]}
          zoom={13}
          className="w-full h-full"
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            lat={lat} 
            lng={lng} 
            onLocationSelect={onLocationSelect} 
          />
        </MapContainer>
      </div>
    </div>
  )
}
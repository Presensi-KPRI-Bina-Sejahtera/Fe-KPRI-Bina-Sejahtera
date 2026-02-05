import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SetoranSearch() {
  return (
    <div className="relative shadow-lg">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input 
        placeholder="Cari nama anggota..." 
        className="pl-10 h-10 bg-white border-3 border-slate-200" 
      />
    </div>
  )
}
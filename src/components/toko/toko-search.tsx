import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export function TokoSearch() {
  return (
    <Card className="shadow-lg border-3 border-slate-200 p-0">
      <CardContent>
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari nama toko..." 
            className="pl-10 h-11 border-none shadow-none focus-visible:ring-0" 
          />
        </div>
      </CardContent>
    </Card>
  )
}
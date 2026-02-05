import { Mail, Save, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ProfileInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <User className="w-4 h-4" />
          Informasi Pribadi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nama</Label>
          <Input id="name" defaultValue="Afif Habiburrohman" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Alamat Email (terhubung dengan Google)</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              id="email" 
              defaultValue="afif@example.com" 
              disabled 
              className="pl-9 bg-slate-50 text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button className="bg-slate-900 text-white hover:bg-slate-800 gap-2">
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </Button>
          <Button variant="outline">
            Batal
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
import { Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function ProfileAvatar() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-slate-100">
            <AvatarImage src="/office.png" className="object-cover" />
            <AvatarFallback>AH</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="text-center space-y-1">
          <h3 className="font-semibold text-lg">Afif Habiburrohman</h3>
          <p className="text-sm text-muted-foreground">username</p>
        </div>

        <Button variant="outline" className="gap-2">
          <Camera className="w-4 h-4" />
          Ubah Foto
        </Button>
      </CardContent>
    </Card>
  )
}
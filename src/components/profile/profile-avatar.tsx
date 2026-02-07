import { useRef } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Camera, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { ProfileData} from "@/services/profileService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { updatePhoto } from "@/services/profileService"

interface ProfileAvatarProps {
  user: ProfileData
}

export function ProfileAvatar({ user }: ProfileAvatarProps) {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const mutation = useMutation({
    mutationFn: (file: File) => updatePhoto(file),
    onSuccess: () => {
      toast.success("Foto profil berhasil diperbarui")
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
    onError: (error: any) => {
      console.error(error)
      toast.error("Gagal mengupload foto. Pastikan ukuran di bawah 512KB.")
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      mutation.mutate(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-slate-100">
            <AvatarImage 
              src={user.profile_image || "/avatars/default.png"} 
              className="object-cover" 
            />
            <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xl">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="text-center space-y-1">
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>

        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleFileChange}
        />

        <Button 
          variant="outline" 
          className="gap-2"
          onClick={handleButtonClick}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
          {mutation.isPending ? "Mengupload..." : "Ubah Foto"}
        </Button>
      </CardContent>
    </Card>
  )
}
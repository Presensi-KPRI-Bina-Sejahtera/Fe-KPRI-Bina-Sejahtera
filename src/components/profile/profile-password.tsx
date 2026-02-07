import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Eye, EyeOff, Loader2, Lock } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePassword } from "@/services/profileService"

interface ProfilePasswordProps {
  hasPassword: boolean
}

export function ProfilePassword({ hasPassword }: ProfilePasswordProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const mutation = useMutation({
    mutationFn: () => updatePassword({
      ...(hasPassword && { current_password: currentPassword }),
      password: newPassword,
      password_confirmation: confirmPassword
    }),
    onSuccess: () => {
      toast.success("Kata sandi berhasil diperbarui")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    },
    onError: (error: any) => {
      console.error(error)
      toast.error(error.response?.data?.message || "Gagal memperbarui kata sandi")
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok")
      return
    }

    if (newPassword.length < 6) {
      toast.error("Kata sandi minimal 6 karakter")
      return
    }

    mutation.mutate()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Lock className="w-4 h-4" />
          Atur Kata Sandi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {hasPassword && (
            <div className="space-y-2">
              <Label htmlFor="current-password">Kata Sandi Saat Ini</Label>
              <div className="relative">
                <Input 
                  id="current-password" 
                  type={showCurrentPassword ? "text" : "password"} 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan kata sandi lama" 
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="new-password">Kata Sandi Baru</Label>
            <div className="relative">
              <Input 
                id="new-password" 
                type={showNewPassword ? "text" : "password"} 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter" 
                className="pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Konfirmasi Kata Sandi Baru</Label>
            <div className="relative">
              <Input 
                id="confirm-password" 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru" 
                className="pr-10" 
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button 
            type="submit"
            variant="outline" 
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 gap-2 w-full md:w-auto"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            {mutation.isPending ? "Memperbarui..." : "Perbarui Kata Sandi"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
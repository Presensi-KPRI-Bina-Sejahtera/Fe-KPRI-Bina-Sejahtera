import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff, Loader2, Lock, KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updatePassword } from '@/services/profileService'

interface ProfilePasswordProps {
  hasPassword: boolean
}

export function ProfilePassword({ hasPassword }: ProfilePasswordProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const mutation = useMutation({
    mutationFn: () =>
      updatePassword({
        ...(hasPassword && { current_password: currentPassword }),
        password: newPassword,
        password_confirmation: confirmPassword,
      }),
    onSuccess: () => {
      toast.success(hasPassword ? 'Kata sandi berhasil diperbarui' : 'Kata sandi berhasil dibuat')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setFieldErrors({})
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setFieldErrors(error.response.data.errors)
      }
      toast.error(
        error.response?.data?.message || 'Gagal memproses kata sandi',
      )
    },
  })

  const handleInputChange = (
    setter: (value: string) => void,
    field: string,
    value: string
  ) => {
    setter(value)
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi kata sandi tidak cocok')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Kata sandi minimal 6 karakter')
      return
    }

    mutation.mutate()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          {hasPassword ? <Lock className="w-4 h-4" /> : <KeyRound className="w-4 h-4" />}
          {hasPassword ? 'Ganti Kata Sandi' : 'Buat Kata Sandi'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {hasPassword && (
            <div className="space-y-2">
              <Label 
                htmlFor="current-password"
                className={fieldErrors.current_password ? "text-red-500" : ""}
              >
                Kata Sandi Saat Ini
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => handleInputChange(setCurrentPassword, 'current_password', e.target.value)}
                  placeholder="Masukkan kata sandi lama"
                  className={`pr-10 ${fieldErrors.current_password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {fieldErrors.current_password && (
                <p className="text-sm text-red-500">{fieldErrors.current_password[0]}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label 
              htmlFor="new-password"
              className={fieldErrors.password ? "text-red-500" : ""}
            >
              Kata Sandi Baru
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => handleInputChange(setNewPassword, 'password', e.target.value)}
                placeholder="Minimal 6 karakter"
                className={`pr-10 ${fieldErrors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {fieldErrors.password && (
              <p className="text-sm text-red-500">{fieldErrors.password[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label 
              htmlFor="confirm-password"
              className={fieldErrors.password_confirmation ? "text-red-500" : ""}
            >
              Konfirmasi Kata Sandi Baru
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => handleInputChange(setConfirmPassword, 'password_confirmation', e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className={`pr-10 ${fieldErrors.password_confirmation ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {fieldErrors.password_confirmation && (
              <p className="text-sm text-red-500">{fieldErrors.password_confirmation[0]}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="outline"
            className={`gap-2 w-full md:w-auto ${
              hasPassword 
                ? "text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" 
                : "text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            }`}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              hasPassword ? <Lock className="w-4 h-4" /> : <KeyRound className="w-4 h-4" />
            )}
            {mutation.isPending 
              ? 'Menyimpan...' 
              : (hasPassword ? 'Perbarui Kata Sandi' : 'Simpan Kata Sandi')
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
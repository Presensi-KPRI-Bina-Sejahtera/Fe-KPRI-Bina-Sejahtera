import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Mail, Save, User } from 'lucide-react'
import { toast } from 'sonner'
import type { ProfileData } from '@/services/profileService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfile } from '@/services/profileService'

interface ProfileInfoProps {
  user: ProfileData
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  const queryClient = useQueryClient()
  const [name, setName] = useState(user.name)

  const mutation = useMutation({
    mutationFn: () =>
      updateProfile({
        name,
        email: user.email,
      }),
    onSuccess: () => {
      toast.success('Profil berhasil diperbarui')
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (error: any) => {
      console.error(error)
      toast.error('Gagal memperbarui profil')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate()
  }

  const handleCancel = () => {
    setName(user.name)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <User className="w-4 h-4" />
          Informasi Pribadi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={mutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Alamat Email (terhubung dengan Google)
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                value={user.email}
                disabled
                className="pl-9 bg-slate-50 text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="bg-slate-900 text-white hover:bg-slate-800 gap-2"
              disabled={mutation.isPending || name === user.name}
            >
              {mutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {mutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={mutation.isPending || name === user.name}
            >
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

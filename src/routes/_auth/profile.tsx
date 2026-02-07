import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { getProfile } from '@/services/profileService'
import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileAvatar } from '@/components/profile/profile-avatar'
import { ProfileInfo } from '@/components/profile/profile-info'
import { ProfilePassword } from '@/components/profile/profile-password'

export const Route = createFileRoute('/_auth/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Gagal memuat data profil. Silakan coba lagi nanti.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 mx-auto w-full max-w-4xl pb-10">
      <div className="flex flex-col gap-6">
        <ProfileHeader />
        <ProfileAvatar user={user} />
        <ProfileInfo user={user} />
        <ProfilePassword hasPassword={user.has_password} />
      </div>
    </div>
  )
}
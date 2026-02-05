import { createFileRoute } from '@tanstack/react-router'
import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileAvatar } from '@/components/profile/profile-avatar'
import { ProfileInfo } from '@/components/profile/profile-info'
import { ProfilePassword } from '@/components/profile/profile-password'

export const Route = createFileRoute('/_auth/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <div className="flex flex-col gap-6 mx-auto w-full">
      <div className="flex flex-col gap-6">
        <ProfileHeader />
        <ProfileAvatar />
        <ProfileInfo />
        <ProfilePassword />
      </div>
    </div>
  )
}

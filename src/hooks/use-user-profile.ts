import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/services/profileService'

export interface User {
  id: number
  name: string
  email: string
  username: string
  role: string
  profile_image?: string
}

export function useUserProfile() {
  return useQuery<User>({
    queryKey: ['profile'],
    queryFn: async () => {
      const data = await getProfile()
      return data as unknown as User
    },
    initialData: () => {
      try {
        const stored = localStorage.getItem("user")
        return stored ? JSON.parse(stored) : undefined
      } catch {
        return undefined
      }
    },
    staleTime: 1000 * 60 * 5,
  })
}
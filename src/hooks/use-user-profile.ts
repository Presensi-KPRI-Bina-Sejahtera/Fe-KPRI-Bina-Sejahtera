import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/services/profileService'

export interface User {
  id: number
  name: string
  email: string
  username: string
  role: 'admin' | 'employee'
  profile_image: string | null
  presence_location_id?: number | null
}

export function useUserProfile() {
  return useQuery<User>({
    queryKey: ['profile'],
    queryFn: async () => {
      const data = await getProfile()
      if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(data))
      }
      return data as unknown as User
    },
    initialData: () => {
      try {
        if (typeof window === 'undefined') return undefined
        const stored = localStorage.getItem("user")
        return stored ? JSON.parse(stored) : undefined
      } catch {
        return undefined
      }
    },
    staleTime: 1000 * 60 * 5,
  })
}
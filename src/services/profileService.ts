import { api } from './api'

export type ProfileData = {
  id: number
  name: string
  username: string
  email: string
  role: string
  profile_image: string | null
  has_password: boolean
}

export type UpdateProfilePayload = {
  name: string
  email: string
}

export type UpdatePasswordPayload = {
  current_password?: string
  password: string
  password_confirmation: string
}

export const getProfile = async () => {
  const response = await api.get<{ status: string; data: ProfileData }>('/profile/me')
  return response.data.data
}

export const updateProfile = async (data: UpdateProfilePayload) => {
  const response = await api.put<{ status: string; data: ProfileData }>(
    '/profile/update', 
    data
  )
  return response.data.data
}

export const updatePassword = async (data: UpdatePasswordPayload) => {
  const response = await api.put<{ status: string; message: string }>(
    '/profile/update-password', 
    data
  )
  return response.data
}

export const updatePhoto = async (file: File) => {
  const formData = new FormData()
  formData.append('photo', file)

  const response = await api.post<{ status: string; data: ProfileData }>(
    '/profile/photo', 
    formData,
    {
        params: {
            _method: 'PUT'
        },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data.data
}
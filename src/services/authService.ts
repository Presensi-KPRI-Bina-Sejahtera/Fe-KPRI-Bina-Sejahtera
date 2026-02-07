import { api } from './api'

export type User = {
  id: number
  name: string
  username: string
  email: string
  role: string
  profile_image: string | null
}

export type LoginResponse = {
  status: string
  message: string
  data: {
    token_type: string
    token: string
    user: User
  }
}

export const login = async (email: string, password: string) => {
  const response = await api.post<LoginResponse>('/auth/login', {
    email,
    password,
  })
  
  return response.data
}

export const isAuthenticated = () => {
  if (typeof window === 'undefined') {
    return false
  }
  
  return !!localStorage.getItem('token')
}

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }
}

export const loginWithGoogle = async (idToken: string) => {
  const formData = new FormData()
  formData.append('id_token', idToken)
  formData.append('device_name', 'web')

  const response = await api.post('/auth/login-google', formData)
  return response.data
}
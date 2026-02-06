import axios from 'axios'
import { env } from '@/env' 

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
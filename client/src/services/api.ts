import axios from 'axios'

export function createApi(token?: string | null) {
  const instance = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000' })
  instance.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
  return instance
}



import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

type User = { id: string; name: string; email: string; role: 'seeker' | 'recruiter' }

type AuthContextValue = {
  token: string | null
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: 'seeker' | 'recruiter') => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function useAuthRole() {
  const { user } = useAuth()
  return user?.role
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const api = useMemo(() => {
    const instance = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000' })
    instance.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`
      return config
    })
    return instance
  }, [token])

  useEffect(() => {
    const load = async () => {
      try {
        if (token) {
          const { data } = await api.get('/api/auth/me')
          setUser(data)
        }
      } catch {
        setToken(null)
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('token', data.token)
  }

  const register = async (name: string, email: string, password: string, role: 'seeker' | 'recruiter') => {
    const { data } = await api.post('/api/auth/register', { name, email, password, role })
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('token', data.token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  const value = { token, user, loading, login, register, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext



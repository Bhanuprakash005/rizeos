import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000' })

export async function register(name: string, email: string, password: string, role: 'seeker' | 'recruiter' = 'seeker') {
  const { data } = await api.post('/api/auth/register', { name, email, password, role })
  return data
}

export async function login(email: string, password: string, role: 'seeker' | 'recruiter' = 'seeker') {
  const { data } = await api.post('/api/auth/login', { email, password, role })
  return data
}



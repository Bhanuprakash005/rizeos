import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/profile')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-gray-400 text-sm mt-1">Log in to your DevLink account</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 outline-none focus:border-purple-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 outline-none focus:border-purple-500" />
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button disabled={loading} className="w-full bg-purple-600/80 hover:bg-purple-600 transition-colors rounded-lg py-2 font-medium">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="text-sm text-gray-400 mt-4">
          Don&apos;t have an account? <Link to="/register" className="text-purple-300 hover:text-purple-200">Register</Link>
        </div>
      </div>
    </div>
  )
}



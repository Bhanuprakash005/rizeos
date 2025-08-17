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
    <div className="min-h-screen relative overflow-hidden bg-[#0b0f14]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(99,102,241,0.25)_0,rgba(0,0,0,0)_70%)]" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md text-white">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-semibold">Welcome back</h1>
            <p className="text-gray-400 text-sm mt-1">Log in to your DevLink account</p>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" />
              </div>
              {error && <div className="text-red-400 text-sm">{error}</div>}
              <button disabled={loading} className="w-full bg-indigo-600/90 hover:bg-indigo-600 active:bg-indigo-700 transition-colors rounded-xl py-2 font-medium">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <div className="text-sm text-gray-400 mt-4 text-center">
              Don&apos;t have an account? <Link to="/register" className="text-indigo-300 hover:text-indigo-200">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



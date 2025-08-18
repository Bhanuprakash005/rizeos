import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'seeker' | 'recruiter'>('seeker')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password, role)
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
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button type="button" onClick={() => setRole('seeker')} className={`rounded-lg py-2 border ${role==='seeker' ? 'bg-indigo-600/80 border-indigo-400 text-white' : 'bg-black/40 border-white/10 text-gray-300'}`}>Seeker</button>
              <button type="button" onClick={() => setRole('recruiter')} className={`rounded-lg py-2 border ${role==='recruiter' ? 'bg-pink-600/80 border-pink-400 text-white' : 'bg-black/40 border-white/10 text-gray-300'}`}>Recruiter</button>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className={`w-full rounded-xl border px-3 py-2 outline-none transition ${role==='recruiter' ? 'bg-black/40 border-pink-400/30 focus:border-pink-500 focus:ring-1 focus:ring-pink-500' : 'bg-black/40 border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`} />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className={`w-full rounded-xl border px-3 py-2 outline-none transition ${role==='recruiter' ? 'bg-black/40 border-pink-400/30 focus:border-pink-500 focus:ring-1 focus:ring-pink-500' : 'bg-black/40 border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`} />
              </div>
              {error && <div className="text-red-400 text-sm">{error}</div>}
              <button disabled={loading} className={`w-full transition-colors rounded-xl py-2 font-medium ${role==='recruiter' ? 'bg-pink-600/90 hover:bg-pink-600 active:bg-pink-700' : 'bg-indigo-600/90 hover:bg-indigo-600 active:bg-indigo-700'}`}>
                {loading ? (role==='recruiter' ? 'Signing in as Recruiter...' : 'Signing in...') : (role==='recruiter' ? 'Sign In as Recruiter' : 'Sign In')}
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



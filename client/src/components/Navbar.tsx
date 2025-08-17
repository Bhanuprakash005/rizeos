import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function Navbar() {
  const { token, logout } = useAuth()
  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur border-b border-slate-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg text-slate-900">DevLink</Link>
        <nav className="flex gap-6 items-center">
          {token ? (
            <>
              <NavLink to="/" className={({ isActive }) => `text-sm ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>Feed</NavLink>
              <NavLink to="/jobs" className={({ isActive }) => `text-sm ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>Jobs</NavLink>
              <NavLink to="/dashboard" className={({ isActive }) => `text-sm ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>Dashboard</NavLink>
              <NavLink to="/profile" className={({ isActive }) => `text-sm ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>Profile</NavLink>
              <button onClick={logout} className="text-sm text-slate-500 hover:text-slate-900">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/home" className={({ isActive }) => `text-sm ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>Home</NavLink>
              <NavLink to="/login" className={({ isActive }) => `text-sm ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>Login</NavLink>
              <NavLink to="/register" className={({ isActive }) => `text-sm ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>Register</NavLink>
            </>
          )}
          <div className="ml-2">
            <WalletMultiButton className="!bg-violet-600/90 hover:!bg-violet-600 !text-white !rounded-lg" />
          </div>
        </nav>
      </div>
    </header>
  )
}



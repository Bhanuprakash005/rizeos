import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function Navbar() {
  const { token, logout, user } = useAuth()
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur bg-black/40 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg text-white">DevLink</Link>
        <nav className="flex gap-6 items-center">
          {token ? (
            <>
              {user?.role === 'seeker' && (
                <>
                  <NavLink to="/" className={({ isActive }) => `text-sm ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}>Home</NavLink>
                  <NavLink to="/jobs" className={({ isActive }) => `text-sm ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}>Jobs</NavLink>
                  <NavLink to="/profile" className={({ isActive }) => `text-sm ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}>Profile</NavLink>
                </>
              )}
              {user?.role === 'recruiter' && (
                <>
                  <NavLink to="/" className={({ isActive }) => `text-sm ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}>Home</NavLink>
                  <NavLink to="/post-job" className={({ isActive }) => `text-sm ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}>Post a Job</NavLink>
                  <NavLink to="/jobs" className={({ isActive }) => `text-sm ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}>My Job Postings</NavLink>
                  <NavLink to="/profile" className={({ isActive }) => `text-sm ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}>Profile</NavLink>
                </>
              )}
              <button onClick={logout} className="text-sm text-gray-300 hover:text-white">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/home" className={({ isActive }) => `text-sm ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>Home</NavLink>
              <NavLink to="/login" className={({ isActive }) => `text-sm ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>Login</NavLink>
              <NavLink to="/register" className={({ isActive }) => `text-sm ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>Register</NavLink>
            </>
          )}
          {user?.role === 'recruiter' && (
            <div className="ml-2">
              <WalletMultiButton className="!bg-purple-600/80 hover:!bg-purple-600 !text-white !rounded-lg" />
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}



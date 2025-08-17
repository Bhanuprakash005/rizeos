import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0b0f14] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-semibold">DevLink</h1>
        <p className="text-gray-400 mt-4 max-w-2xl">Connect with developers, showcase your profile, and discover jobs. Pay on-chain with Solana to promote your job posts.</p>
        <div className="mt-8 flex gap-4">
          <Link to="/register" className="bg-purple-600/80 hover:bg-purple-600 rounded-lg px-5 py-3 font-medium">Get Started</Link>
          <Link to="/login" className="bg-white/10 hover:bg-white/20 rounded-lg px-5 py-3 font-medium">Sign In</Link>
        </div>
      </div>
    </div>
  )
}



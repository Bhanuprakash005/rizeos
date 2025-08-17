import { Link } from 'react-router-dom'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-violet-100 via-pink-100 to-sky-100 border border-slate-200 p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Welcome to DevLink</h2>
        <p className="text-slate-600 mt-2">Manage your profile, explore the feed, and post jobs with on-chain payments.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/profile" className="px-4 py-2 rounded-lg bg-slate-900 text-white">Edit Profile</Link>
          <Link to="/" className="px-4 py-2 rounded-lg bg-white border border-slate-300">Go to Feed</Link>
          <Link to="/jobs" className="px-4 py-2 rounded-lg bg-white border border-slate-300">Browse Jobs</Link>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white border border-slate-200 p-6">
          <h3 className="font-semibold">Quick Actions</h3>
          <ul className="mt-3 text-slate-600 list-disc pl-5">
            <li>Update your skills and LinkedIn</li>
            <li>Connect Phantom wallet</li>
            <li>Post a new job</li>
          </ul>
        </div>
        <div className="rounded-xl bg-white border border-slate-200 p-6">
          <h3 className="font-semibold">Tips</h3>
          <p className="text-slate-600 mt-2">Use AI suggestions to enrich your skills and normalize your location for better job matches.</p>
        </div>
      </div>
    </div>
  )
}



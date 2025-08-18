import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Post } from '../services/postService'
import { useAuth } from '../contexts/AuthContext'
import { createApplication } from '../services/applicationService'
import { matchCandidates } from '../services/aiService'

export default function JobDetailPage() {
  const { id } = useParams()
  const [job, setJob] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [matching, setMatching] = useState(false)
  const [candidates, setCandidates] = useState<any[]>([])
  const { token, user } = useAuth()

  useEffect(() => {
    const run = async () => {
      try {
        const data = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/posts/${id}`).then(r => r.json())
        setJob(data)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [id])

  if (loading) return <div className="text-gray-400">Loading...</div>
  if (!job) return <div className="text-gray-400">Job not found</div>

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur rounded-xl p-6 text-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{job.title}</h1>
          {job.companyName && <div className="text-gray-300 mt-1">{job.companyName}</div>}
          {job.location && <div className="text-gray-400 text-sm mt-1">{job.location}</div>}
        </div>
        {job.companyWebsite && <a href={job.companyWebsite} target="_blank" className="px-4 py-2 rounded-lg bg-indigo-600/80 hover:bg-indigo-600">Company Site</a>}
      </div>
      <div className="mt-5">
        <h3 className="font-semibold">Description</h3>
        <p className="text-gray-200 mt-2 whitespace-pre-wrap">{job.description}</p>
      </div>
      {!!job.requirements?.length && (
        <div className="mt-5">
          <h3 className="font-semibold">Requirements</h3>
          <ul className="list-disc pl-5 mt-2 text-gray-200">
            {job.requirements.map((r, i) => (<li key={i}>{r}</li>))}
          </ul>
        </div>
      )}
      {!!job.skills?.length && (
        <div className="mt-5">
          <h3 className="font-semibold">Skills</h3>
          <div className="flex gap-2 flex-wrap mt-2">
            {job.skills.map(s => (<span key={s} className="text-xs bg-white/10 border border-white/10 rounded-full px-2 py-1">{s}</span>))}
          </div>
        </div>
      )}
      <div className="mt-6 flex gap-3">
        {user?.role === 'seeker' && (
          <button onClick={() => token && id && createApplication(token, id)} className="px-5 py-2 rounded-lg bg-emerald-600/80 hover:bg-emerald-600">Apply</button>
        )}
        {user?.role === 'recruiter' && (
          <button disabled={matching} onClick={async () => {
            if (!token || !id) return
            setMatching(true)
            try {
              const res = await matchCandidates(token, id)
              setCandidates(res)
            } finally { setMatching(false) }
          }} className="px-5 py-2 rounded-lg bg-indigo-600/80 hover:bg-indigo-600">{matching ? 'Finding...' : 'Find Top Candidates'}</button>
        )}
      </div>
      {user?.role === 'recruiter' && candidates.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold">Top Candidates</h3>
          <div className="mt-3 space-y-3">
            {candidates.map((c, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{c.candidate.name}</div>
                    <div className="text-sm text-gray-400">{c.candidate.email}</div>
                  </div>
                  <div className="text-sm text-gray-300">Score: {c.score}</div>
                </div>
                <div className="text-gray-300 mt-2">{c.summary}</div>
                <div className="mt-2 flex gap-2 flex-wrap text-gray-200">
                  {c.candidate.skills?.map((s: string) => (<span key={s} className="text-xs bg-white/10 border border-white/10 rounded-full px-2 py-1">{s}</span>))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}



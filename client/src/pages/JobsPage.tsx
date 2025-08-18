import { useEffect, useMemo, useState } from 'react'
import { getPostsQuery, type Post } from '../services/postService'
import PostCard from '../components/PostCard'
import { useAuth } from '../contexts/AuthContext'
import { getMyProfile } from '../services/profileService'
import { normalizeLocation } from '../services/aiService'
import { createApplication } from '../services/applicationService'

export default function JobsPage() {
  const [jobs, setJobs] = useState<Post[]>([])
  const [skill, setSkill] = useState('')
  const [location, setLocation] = useState('')
  const [tags, setTags] = useState('')
  const { token, user } = useAuth()
  const base = useMemo(() => import.meta.env.VITE_API_BASE || 'http://localhost:5000', [])

  useEffect(() => {
    const run = async () => {
      const data = await getPostsQuery({ skill, location, tags })
      const allJobs = data.filter((p: Post) => p.type === 'job')
      if (user?.role === 'recruiter') {
        setJobs(allJobs.filter((p: any) => (p.user?._id || p.user?.id) === (user.id)))
      } else {
        setJobs(allJobs)
      }
    }
    run()
  }, [skill, location, tags])

  const onAIMatch = async () => {
    if (!token) return
    const profile = await getMyProfile(token)
    const userSkills: string[] = profile.skills || []
    const userLoc = profile.location || ''
    const norm = userLoc ? await normalizeLocation(token, userLoc) : ''
    const all = await getPostsQuery({})
    const jobOnly = all.filter((p) => p.type === 'job')
    const scored = jobOnly.map((p) => {
      const overlap = (p.skills || []).filter(s => userSkills.includes(s)).length
      const near = norm && p.location ? p.location.toLowerCase().includes(norm.toLowerCase()) : false
      const score = overlap * 2 + (near ? 3 : 0)
      return { job: p, score, overlap, near }
    }).sort((a,b) => b.score - a.score)

    // Keep only strong matches: at least 4 overlapping skills (or overlap + near), then top 3
    const filteredTop = scored.filter(x => x.overlap >= 4 || (x.overlap >= 2 && x.near)).slice(0, 3)
    // Fallback: if none meet threshold, show top 3 by score
    const result = filteredTop.length ? filteredTop : scored.slice(0, 3)
    setJobs(result.map(x => x.job))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      <aside className="bg-white/5 border border-white/10 backdrop-blur rounded-xl p-4 text-white">
        <h3 className="font-semibold">Filter Jobs</h3>
        <div className="mt-3 space-y-3">
          <input value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="Skill" className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" />
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma)" className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" />
          <button onClick={onAIMatch} className="w-full rounded-lg bg-indigo-600/80 hover:bg-indigo-600 py-2">AI Match</button>
        </div>
      </aside>
      <section className="space-y-4">
        {jobs.map((p) => (
          <div key={p._id} className="space-y-2">
            <PostCard post={p} />
            {token && user?.role === 'seeker' && (
              <button onClick={() => createApplication(token, p._id)} className="rounded-lg bg-emerald-600/80 hover:bg-emerald-600 px-4 py-2">Apply</button>
            )}
          </div>
        ))}
      </section>
    </div>
  )
}



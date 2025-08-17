import { useEffect, useState } from 'react'
import { getPosts, type Post } from '../services/postService'
import PostCard from '../components/PostCard'

export default function JobsPage() {
  const [jobs, setJobs] = useState<Post[]>([])
  const [skill, setSkill] = useState('')
  const [location, setLocation] = useState('')
  const [tags, setTags] = useState('')

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams()
      if (skill) params.set('skill', skill)
      if (location) params.set('location', location)
      if (tags) params.set('tags', tags)
      const data = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/posts?${params}`).then(r => r.json())
      setJobs(data.filter((p: Post) => p.type === 'job'))
    }
    run()
  }, [skill, location, tags])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      <aside className="bg-white border border-slate-200 rounded-xl p-4">
        <h3 className="font-semibold">Filter Jobs</h3>
        <div className="mt-3 space-y-3">
          <input value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="Skill" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma)" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
      </aside>
      <section className="space-y-4">
        {jobs.map((p) => <PostCard key={p._id} post={p} />)}
      </section>
    </div>
  )
}



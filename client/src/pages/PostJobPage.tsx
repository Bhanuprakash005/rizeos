import { FormEvent, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { createPost } from '../services/postService'

export default function PostJobPage() {
  const { token, user } = useAuth()
  const [title, setTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')
  const [description, setDescription] = useState('')
  const [skills, setSkills] = useState('')
  const [location, setLocation] = useState('')
  const [budget, setBudget] = useState<number | ''>('')
  const [requirements, setRequirements] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  if (user?.role !== 'recruiter') {
    return <div className="text-gray-400">Only recruiters can post jobs.</div>
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!token) return
    setSaving(true)
    setMessage(null)
    try {
      await createPost(token, {
        type: 'job',
        title,
        description,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        location,
        budget: typeof budget === 'number' ? budget : undefined,
        companyName,
        companyWebsite,
        requirements: requirements.split('\n').map(s => s.trim()).filter(Boolean),
      })
      setMessage('Job posted successfully')
      setTitle(''); setCompanyName(''); setCompanyWebsite(''); setDescription(''); setSkills(''); setLocation(''); setBudget(''); setRequirements('')
    } catch (e: any) {
      setMessage(e?.response?.data?.message || 'Failed to post job')
    } finally { setSaving(false) }
  }

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur rounded-xl p-6 text-white">
      <h1 className="text-xl font-semibold mb-4">Post a Job</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Company Name</label>
            <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Company Website</label>
            <input value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Skills (comma separated)</label>
            <input value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Budget (USD)</label>
            <input value={budget} onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : '')} type="number" className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Requirements (one per line)</label>
          <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={4} className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" />
        </div>
        {message && <div className="text-sm text-gray-300">{message}</div>}
        <div className="flex justify-end">
          <button disabled={saving} className="rounded-lg bg-indigo-600/80 hover:bg-indigo-600 px-4 py-2">{saving ? 'Posting...' : 'Post Job'}</button>
        </div>
      </form>
    </div>
  )
}



import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import { useAuth } from '../contexts/AuthContext'
import { getMyProfile, updateMyProfile } from '../services/profileService'
import { extractSkills, normalizeLocation } from '../services/aiService'
import { useWallet } from '@solana/wallet-adapter-react'

export default function ProfilePage() {
  const { token, user } = useAuth()
  const { publicKey } = useWallet()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const [skillsSuggestion, setSkillsSuggestion] = useState<string[]>([])

  useEffect(() => {
    const run = async () => {
      if (!token) { setLoading(false); return }
      setLoading(true)
      try {
        const data = await getMyProfile(token)
        setProfile(data)
      } catch (e) {
        console.error('Failed to load profile', e)
        setProfile({ bio: '', linkedIn: '', skills: [], walletAddress: '' })
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [token])

  const onSave = async () => {
    if (!token) return
    const payload = {
      bio: profile.bio || '',
      linkedIn: profile.linkedIn || '',
      skills: profile.skills || [],
      walletAddress: profile.walletAddress || publicKey?.toBase58() || '',
    }
    const updated = await updateMyProfile(token, payload)
    setProfile(updated)
    setOpen(false)
  }

  const onSuggest = async () => {
    if (!token) return
    const skills = await extractSkills(token, profile.bio || '')
    setSkillsSuggestion(skills)
    if (skills && skills.length) {
      const merged = Array.from(new Set([...(profile.skills || []), ...skills]))
      setProfile({ ...profile, skills: merged })
    }
  }

  const onNormalizeLocation = async () => {
    if (!token) return
    const normalized = await normalizeLocation(token, profile.location || '')
    setProfile({ ...profile, location: normalized })
  }

  if (loading) return <div className="text-gray-400">Loading...</div>

  return (
    <div className="space-y-4">
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5">
        <h2 className="text-xl font-semibold">{user?.name}</h2>
        <p className="text-gray-400">{user?.email}</p>
        <div className="mt-4 space-y-2">
          <div>
            <div className="text-gray-400 text-sm">Bio</div>
            <div className="text-gray-200">{profile?.bio || '—'}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">LinkedIn</div>
            <a className="text-purple-300" href={profile?.linkedIn} target="_blank">{profile?.linkedIn || '—'}</a>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Skills</div>
            <div className="flex gap-2 flex-wrap">
              {profile?.skills?.length ? profile.skills.map((s: string) => (
                <span key={s} className="text-xs bg-white/10 border border-white/10 rounded-full px-2 py-1 text-gray-200">{s}</span>
              )) : <span className="text-gray-500">—</span>}
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Wallet</div>
            <div className="text-gray-200">{profile?.walletAddress || '—'}</div>
          </div>
        </div>
        <button onClick={() => setOpen(true)} className="mt-4 bg-purple-600/80 hover:bg-purple-600 rounded-lg px-4 py-2">Edit Profile</button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Edit Profile">
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Bio</label>
            <textarea value={profile?.bio || ''} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={4} className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" />
            <button onClick={onSuggest} className="mt-2 text-sm text-purple-300">✨ Auto-Suggest Skills from Bio</button>
            {skillsSuggestion.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {skillsSuggestion.map((s) => (
                  <button key={s} onClick={() => setProfile({ ...profile, skills: Array.from(new Set([...(profile.skills || []), s])) })} className="text-xs bg-white/10 border border-white/10 rounded-full px-2 py-1 text-gray-200 hover:bg-white/20">{s}</button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">LinkedIn URL</label>
            <input value={profile?.linkedIn || ''} onChange={(e) => setProfile({ ...profile, linkedIn: e.target.value })} className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Location</label>
            <div className="flex gap-2">
              <input value={profile?.location || ''} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" />
              <button onClick={onNormalizeLocation} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm">Normalize</button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Skills</label>
            <input value={(profile?.skills || []).join(', ')} onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Wallet Address</label>
            <input value={profile?.walletAddress || publicKey?.toBase58() || ''} onChange={(e) => setProfile({ ...profile, walletAddress: e.target.value })} className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg bg-white/10">Cancel</button>
            <button onClick={onSave} className="px-4 py-2 rounded-lg bg-emerald-600/80 hover:bg-emerald-600">Save</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}



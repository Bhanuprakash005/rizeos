import { useEffect, useMemo, useState } from 'react'
import { getPosts, createPost, type Post } from '../services/postService'
import { logPayment } from '../services/paymentService'
import PostCard from '../components/PostCard'
import Modal from '../components/Modal'
import { useWallet } from '@solana/wallet-adapter-react'
import { SystemProgram, LAMPORTS_PER_SOL, Transaction, PublicKey, Connection } from '@solana/web3.js'
import { useAuth } from '../contexts/AuthContext'

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filter, setFilter] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<{ type: 'job' | 'feed'; title: string; description: string; skills: string; budget?: number; sig?: string }>({ type: 'job', title: '', description: '', skills: '' })
  const { publicKey, sendTransaction, connected } = useWallet()
  const { token } = useAuth()
  const paymentMode = (import.meta.env.VITE_PAYMENT_MODE as string) || 'real' // 'real' | 'mock'

  const admin = useMemo(() => (import.meta.env.VITE_ADMIN_WALLET_ADDRESS as string) || '', [])
  const endpoint = useMemo(() => `https://api.${import.meta.env.VITE_SOLANA_NETWORK || 'devnet'}.solana.com`, [])

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const data = await getPosts(filter || undefined)
        setPosts(data)
      } catch (e) {
        console.error('Failed to load posts', e)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [filter])

  const onPay = async () => {
    if (paymentMode === 'mock') {
      const sig = `MOCK-${Date.now()}`
      setForm((f) => ({ ...f, sig }))
      if (token) {
        await logPayment(token, { amountSol: 0.0001, toAddress: admin, transactionSignature: sig, mode: 'mock' })
      }
      return
    }
    if (!connected || !publicKey) throw new Error('Connect wallet first')
    const connection = new Connection(endpoint)
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(admin),
        lamports: Math.floor(0.0001 * LAMPORTS_PER_SOL),
      })
    )
    const sig = await sendTransaction(tx, connection)
    setForm((f) => ({ ...f, sig }))
    if (token) {
      await logPayment(token, { amountSol: 0.0001, toAddress: admin, transactionSignature: sig, mode: 'real' })
    }
  }

  const onAirdrop = async () => {
    if (!publicKey) return
    const connection = new Connection(endpoint)
    try {
      const sig = await connection.requestAirdrop(publicKey, Math.floor(0.01 * LAMPORTS_PER_SOL))
      await connection.confirmTransaction(sig, 'confirmed')
      alert('Airdrop requested. It may take a few seconds to reflect in your balance.')
    } catch (e) {
      console.error('Airdrop failed', e)
    }
  }

  const onSubmitPost = async () => {
    if (!token) return
    const payload: Partial<Post> = {
      type: form.type,
      title: form.title,
      description: form.description,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      budget: form.budget,
      transactionSignature: form.sig,
    }
    const created = await createPost(token, payload)
    setPosts((p) => [created, ...p])
    setOpen(false)
    setForm({ type: 'job', title: '', description: '', skills: '' })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
      <aside className="space-y-4">
        <div className="bg-white/5 border border-white/10 backdrop-blur rounded-xl p-4">
          <h3 className="font-semibold">Filter by skill</h3>
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="e.g. React" className="mt-2 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 outline-none focus:border-purple-500" />
        </div>
        <button onClick={() => setOpen(true)} className="w-full bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg py-2 font-medium">Post a Job</button>
      </aside>
      <section className="space-y-4">
        {loading ? (
          <div className="text-gray-400">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-gray-400">No posts yet.</div>
        ) : (
          posts.map((p) => <PostCard key={p._id} post={p} />)
        )}
      </section>

      <Modal open={open} onClose={() => setOpen(false)} title="Post a Job">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'job' | 'feed' })} className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2">
                <option value="job">Job</option>
                <option value="feed">Feed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Budget (optional)</label>
              <input type="number" value={form.budget ?? ''} onChange={(e) => setForm({ ...form, budget: e.target.value ? Number(e.target.value) : undefined })} className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Skills (comma separated)</label>
            <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button onClick={onPay} className="bg-indigo-600/80 hover:bg-indigo-600 rounded-lg px-4 py-2">{paymentMode === 'mock' ? 'Mock Pay' : 'Pay 0.0001 SOL to Post'}</button>
              <button onClick={onAirdrop} className="bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 text-sm">Devnet Airdrop 0.01</button>
            </div>
            <button disabled={!form.sig} onClick={onSubmitPost} className={`rounded-lg px-4 py-2 ${form.sig ? 'bg-emerald-600/80 hover:bg-emerald-600' : 'bg-gray-600 cursor-not-allowed'}`}>Submit Job</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}



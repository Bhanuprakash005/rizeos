import { FormEvent, useEffect, useState } from 'react'
import { createPost, getPosts, type Post } from '../services/postService'
import PostCard from '../components/PostCard'
import Modal from '../components/Modal'
import { useAuth } from '../contexts/AuthContext'

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filter, setFilter] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')
  const { token } = useAuth()

  const onCreateFeedPost = async (e: FormEvent) => {
    e.preventDefault()
    if (!token) return
    await createPost(token, { type: 'feed', description: content })
    setOpen(false)
    setContent('')
    const data = await getPosts(filter || undefined)
    setPosts(data)
  }

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

  // posting removed

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
      <aside className="space-y-4">
        {/* <div className="bg-white/5 border border-white/10 backdrop-blur rounded-xl p-4">
          <h3 className="font-semibold">Filter by skill</h3>
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="e.g. React" className="mt-2 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 outline-none focus:border-purple-500" />
        </div> */}
        {/* Posting removed for candidate users */}
      </aside>
      <section className="space-y-4">
        <div className="flex justify-end">
          <button onClick={() => setOpen(true)} className="rounded-lg bg-indigo-600/80 hover:bg-indigo-600 px-4 py-2">New Post</button>
        </div>
        {loading ? (
          <div className="text-gray-400">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-gray-400">No posts yet.</div>
        ) : (
          posts.map((p) => <PostCard key={p._id} post={p} />)
        )}
      </section>

      <Modal open={open} onClose={() => setOpen(false)} title="Create Post">
        <form onSubmit={onCreateFeedPost} className="space-y-3">
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2" placeholder="Share an update..." />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg bg-white/10">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600/80 hover:bg-emerald-600">Post</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}



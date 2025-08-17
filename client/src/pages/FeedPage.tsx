import { useEffect, useState } from 'react'
import { getPosts, type Post } from '../services/postService'
import PostCard from '../components/PostCard'
import Modal from '../components/Modal'

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filter, setFilter] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [open, setOpen] = useState(false)

  // posting removed – keep modal state placeholder if needed later

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
        {loading ? (
          <div className="text-gray-400">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-gray-400">No posts yet.</div>
        ) : (
          posts.map((p) => <PostCard key={p._id} post={p} />)
        )}
      </section>

      {/* Modal removed */}
    </div>
  )
}



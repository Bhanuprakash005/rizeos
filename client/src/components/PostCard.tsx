import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { Post } from '../services/postService'

export default function PostCard({ post }: { post: Post }) {
  const isJob = post.type === 'job'
  const navigate = useNavigate()
  const onClick = () => {
    if (isJob) navigate(`/jobs/${post._id}`)
  }
  return (
    <motion.div onClick={onClick} role={isJob ? 'button' : undefined} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl p-5 transition ${isJob ? 'cursor-pointer hover:bg-white/10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]' : ''} bg-white/5 backdrop-blur border border-white/10`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          {post.title && <h3 className="text-lg font-semibold">{post.title}</h3>}
          {isJob && post.companyName && <div className="text-sm text-gray-400">{post.companyName}</div>}
          <p className="text-gray-300 mt-1 whitespace-pre-wrap">{post.description}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${isJob ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'}`}>{post.type}</span>
      </div>
      {isJob && (
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          {post.skills?.map((s) => (
            <span key={s} className="text-xs bg-white/10 border border-white/10 rounded-full px-2 py-1 text-gray-200">{s}</span>
          ))}
          {typeof post.budget === 'number' && (
            <span className="text-sm text-gray-300">Budget: <span className="text-white font-medium">${post.budget}</span></span>
          )}
        </div>
      )}
    </motion.div>
  )
}



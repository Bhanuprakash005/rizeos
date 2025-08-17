import { createApi } from './api'

export type Post = {
  _id: string
  user: { id?: string; _id?: string; name: string; email: string }
  type: 'job' | 'feed'
  title?: string
  description: string
  skills?: string[]
  budget?: number
  transactionSignature?: string
  createdAt?: string
}

export async function getPosts(skill?: string) {
  const api = createApi()
  const { data } = await api.get('/api/posts', { params: skill ? { skill } : {} })
  return data as Post[]
}

export async function getPostsQuery(params: { skill?: string; location?: string; tags?: string }) {
  const api = createApi()
  const { data } = await api.get('/api/posts', { params })
  return data as Post[]
}

export async function createPost(token: string, payload: Partial<Post>) {
  const api = createApi(token)
  const { data } = await api.post('/api/posts', payload)
  return data as Post
}



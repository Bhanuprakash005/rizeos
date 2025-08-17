import { createApi } from './api'

export async function getMyProfile(token: string) {
  const api = createApi(token)
  const { data } = await api.get('/api/profiles/me')
  return data
}

export async function updateMyProfile(token: string, payload: any) {
  const api = createApi(token)
  const { data } = await api.put('/api/profiles/me', payload)
  return data
}

export async function extractSkillsFromBio(token: string, text: string) {
  const api = createApi(token)
  const { data } = await api.post('/api/ai/extract-skills', { text })
  return data.skills as string[]
}



import { createApi } from './api'

export async function extractSkills(token: string, text: string) {
  const api = createApi(token)
  const { data } = await api.post('/api/ai/extract-skills', { text })
  return data.skills as string[]
}

export async function normalizeLocation(token: string, location: string) {
  const api = createApi(token)
  const { data } = await api.post('/api/ai/normalize-location', { location })
  return data.normalized as string
}

export async function matchCandidates(token: string, jobId: string) {
  const api = createApi(token)
  const { data } = await api.post('/api/ai/match-candidates', { jobId })
  return data.candidates as Array<any>
}



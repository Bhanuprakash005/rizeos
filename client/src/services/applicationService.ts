import { createApi } from './api'

export async function createApplication(token: string, jobId: string) {
  const api = createApi(token)
  const { data } = await api.post('/api/applications', { jobId })
  return data
}

export async function getMyApplications(token: string) {
  const api = createApi(token)
  const { data } = await api.get('/api/applications/mine')
  return data
}

export async function getJobApplications(token: string, jobId: string) {
  const api = createApi(token)
  const { data } = await api.get(`/api/applications/job/${jobId}`)
  return data
}



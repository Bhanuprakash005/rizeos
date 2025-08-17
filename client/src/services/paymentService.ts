import { createApi } from './api'

export async function logPayment(token: string, payload: { amountSol: number; toAddress: string; transactionSignature: string; mode?: 'real' | 'mock' }) {
  const api = createApi(token)
  const { data } = await api.post('/api/payments', payload)
  return data
}



import xior from 'xior'
import type { User } from '@/types/user'


export async function getSelf() {
  const res = await xior.get<{ success: boolean; data: User }>('/api/self', {
    credentials: 'include'
  })

  return res.data
}

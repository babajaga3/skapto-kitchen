import { api } from './xior'
import xior from 'xior'


export async function login(email: string, password: string) {
  const res = await xior.post('/api/auth', {
    email,
    password
  })

  console.log(res)

  return res.data
}

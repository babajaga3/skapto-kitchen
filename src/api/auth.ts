import xior from 'xior'


export async function login(email: string, password: string) {
  const res = await xior.post('/api/auth/login', {
    email,
    password
  })

  return res.data
}

export async function logout() {
  const res = await xior.post('/api/auth/logout')

  return res.data
}

import { NextRequest, NextResponse } from 'next/server'
import PocketBase from 'pocketbase'


const pb = new PocketBase('https://skapto-pb.thec0derhere.me')

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { email, password } = await req.json()

  try {
    const data = await pb.collection('users').authWithPassword(email, password)
    const response = NextResponse.json({ success: true, data })

    response.cookies.set('pb_auth', pb.authStore.exportToCookie(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60
    })

    return response
  } catch {
    return new NextResponse(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401
    })
  }
}

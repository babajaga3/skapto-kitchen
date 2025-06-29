import { NextRequest, NextResponse } from 'next/server'
import PocketBase from 'pocketbase'
import { User } from '@/types/user'
import { tryCatch } from '@/lib/try-catch'
import { internalServerError, ok, unauthorized } from '@/lib/api'


export async function POST(req: NextRequest): Promise<NextResponse> {
  const { email, password } = await req.json()
  const pb = new PocketBase('https://skapto-pb.thec0derhere.me')

  try {
    // validate input
    const { data } = await tryCatch(pb.collection('users').authWithPassword<User>(email, password))

    // If data is null, it means authentication failed
    if (!data) {
      return unauthorized('Invalid credentials')
    }

    const response = ok(data)

    // Set auth cookie
    response.cookies.set('pb_auth', pb.authStore.exportToCookie(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60
    })

    return response
  } catch (error) {
    return internalServerError(error)
  }
}

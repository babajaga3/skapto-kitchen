import { db } from '@/db'
import { internalServerError, ok, unauthorized } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'


export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { email, password } = await req.json()

    const result = await db.authenticate(email, password)

    if (result.isOk()) {

      const response = ok(result.value)

      // Set auth cookie
      response.cookies.set('pb_auth', db.client.authStore.exportToCookie(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60
      })

      return response
    }

    return unauthorized()
  } catch (error) {
    return internalServerError(error)
  }
}

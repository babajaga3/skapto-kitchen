import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'


export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set('pb_auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0) // immediately expires the cookie
  })

  redirect('/sign-in')
}

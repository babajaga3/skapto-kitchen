import { NextResponse } from 'next/server'
import { verifyUser } from '@/lib/utils'


export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('pb_auth')

  await verifyUser(response.cookies.get('pb_auth')?.value ?? '')

  return response
}

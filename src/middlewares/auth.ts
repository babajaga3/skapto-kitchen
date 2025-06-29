import { NextRequest, NextResponse } from 'next/server'
import PocketBase from 'pocketbase'
import { verifyUser } from '@/lib/utils'


const PUBLIC_PATHS = new Set([
  '/',
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password'
])

export async function auth(request: NextRequest): Promise<NextResponse> {
  const requestUrl = request.nextUrl.clone()
  const pathname = requestUrl.pathname
  const token = request.cookies.get('pb_auth')?.value ?? ''

  const { isAuthenticated } = await verifyUser(token)

  const isPublicPath = PUBLIC_PATHS.has(pathname)

  // Redirect unauthenticated users trying to access protected paths
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL('/sign-in', requestUrl))
  }

  // Redirect authenticated users trying to access public auth pages
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', requestUrl))
  }

  // Otherwise allow the request to proceed
  return NextResponse.next()
}

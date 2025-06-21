import { NextRequest, NextResponse } from 'next/server'
import PocketBase from 'pocketbase'


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

  const pb = new PocketBase('https://skapto-pb.thec0derhere.me')

  let isAuthenticated = false

  if (token) {
    try {
      pb.authStore.loadFromCookie(token)
      await pb.collection('users').authRefresh()
      isAuthenticated = pb.authStore.isValid
    } catch {
      pb.authStore.clear()
    }
  }

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

import { NextRequest, NextResponse } from 'next/server'


const DEFAULT_KITCHEN_COOKIE = 'main-kitchen'

export function defaultKitchen(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const kitchen = request.cookies.get(DEFAULT_KITCHEN_COOKIE)?.value

  const isOnRoot = pathname === '/'
  const isProtectedPath = pathname !== '/'

  // Case 1: User doesn't have a kitchen and is accessing a protected path → redirect to root
  if (!kitchen && isProtectedPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Case 2: User has kitchen but is on root → redirect to dashboard
  if (kitchen && isOnRoot) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
}

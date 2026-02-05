import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { type NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'


export async function auth(request: NextRequest): Promise<NextResponse> {
  const isLoggedIn = await db.isAuthenticated(request.cookies as unknown as ReadonlyRequestCookies) // todo fix types

  if (
    request.nextUrl.pathname
      && request.nextUrl.pathname.startsWith('/auth')
  ) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
  }

  // handling other unprotected routes goes here

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  return NextResponse.next()
}

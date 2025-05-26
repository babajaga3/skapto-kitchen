import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export function middleware(request: NextRequest) {
  const hasKitchen = request.cookies.get('main-kitchen')

  // TODO Router for unauthenticated below (future)
  // ...

  // Ensure user has set their default kitchen
  if (!hasKitchen && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (hasKitchen && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Everything except next & assets
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)'
}

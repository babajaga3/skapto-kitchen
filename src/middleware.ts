import type { NextRequest } from 'next/server'
import { auth } from '@/middlewares/auth'
import { defaultKitchen } from '@/middlewares/kitchen'
import { composeMiddleware } from '@/middlewares'


export function middleware(request: NextRequest) {
  const chain = composeMiddleware([
    auth,
    defaultKitchen,
  ])

  return chain(request)
}

export const config = {
  // Everything except next & assets
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)'
}

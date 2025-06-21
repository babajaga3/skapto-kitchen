import type { NextRequest } from 'next/server'
import { auth } from '@/middlewares/auth'
import { defaultKitchen } from '@/middlewares/kitchen'
import { composeMiddleware } from '@/middlewares'


export function middleware(request: NextRequest) {
  const chain = composeMiddleware([
    auth,
    defaultKitchen
  ])

  return chain(request)
}

// todo add a more sophisticated matcher
export const config = {
  matcher: [ '/((?!api|_next/static|_next/image|.*\\.png$).*)' ]
}

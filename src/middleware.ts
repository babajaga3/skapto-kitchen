import type { NextRequest } from 'next/server'
import { auth } from '@/middlewares/auth'
import { defaultKitchen } from '@/middlewares/kitchen'
import { composeMiddleware } from '@/middlewares'


export function middleware(request: NextRequest) {
  console.info(`[middleware] ${request.method} ${request.url}`)

  const chain = composeMiddleware([
    auth,
    defaultKitchen
  ])

  return chain(request)
}

// todo add a more sophisticated matcher
// https://nextjs.org/docs/app/api-reference/file-conventions/middleware#matcher
export const config = {
  matcher: [ '/((?!api|_next/static|_next/image|.*\\.png$).*)' ]
}

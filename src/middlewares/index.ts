import { NextRequest, NextResponse } from 'next/server'


type MiddlewareResponse = NextResponse | void

type MiddlewareHandler = (req: NextRequest) => Promise<MiddlewareResponse> | MiddlewareResponse

export function composeMiddleware(handlers: MiddlewareHandler[]): MiddlewareHandler {
  return async (req: NextRequest) => {
    for (const handler of handlers) {
      const result = await handler(req)
      if (result instanceof NextResponse) {
        return result // short-circuit
      }
    }

    return NextResponse.next()
  }
}

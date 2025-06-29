import { NextResponse } from 'next/server'


export function ok<T>(data: T, message?: string) {
  return NextResponse.json({ success: true, data, message }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function created<T>(data: T, message?: string) {
  return NextResponse.json({ success: true, data, message: message ?? 'Created' }, {
    status: 201,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function notFound(message?: string) {
  return NextResponse.json({ success: false, message: message ?? 'Not found' }, {
    status: 404,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function badRequest(message?: string) {
  return NextResponse.json({ success: false, message: message ?? 'Bad request' }, {
    status: 400,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function internalServerError<T>(error?: T, message?: string) {
  return NextResponse.json({ success: false, error, message: message ?? 'Internal server error' }, {
    status: 500,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function unauthorized(message?: string) {
  return NextResponse.json({ success: false, message: message ?? 'Unauthorized' }, {
    status: 401,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function forbidden(message?: string) {
  return NextResponse.json({ success: false, message: message ?? 'Forbidden' }, {
    status: 403,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function raw(body: BodyInit, init: ResponseInit) {
  return new NextResponse(body, init)
}

export const res = {
  ok,
  created,
  notFound,
  badRequest,
  internalServerError,
  unauthorized,
  forbidden
}

export default res

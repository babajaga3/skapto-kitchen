import { NextResponse } from 'next/server'
import { CalendarEvents } from '@/db/calendar-events'
import xior from 'xior'
import { ok, raw } from '@/lib/api'


// todo sort of beta
async function checkDatabase() {
  try {
    const data = await CalendarEvents.getAll()

    return !!data
  } catch {
    return false
  }
}

async function checkExternalApi() {
  try {
    const res = await xior.get(process.env.EXTERNAL_API_CHECK ?? 'https://www.cloudflare.com/cdn-cgi/trace', {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      method: 'HEAD',
      signal: AbortSignal.timeout(2000)
    })

    return res.status === 200
  } catch {
    return false
  }
}

export async function GET() {
  const [ dbOk, apiOk ] = await Promise.all([
    checkDatabase(),
    checkExternalApi()
  ])

  const healthy = dbOk && apiOk
  const resData = { healthy, dbOk, apiOk, timestamp: Date.now() }

  if (!healthy) {
    return raw(JSON.stringify({ data: resData }), {
      status: 503
    })
  }

  return ok(resData)
}

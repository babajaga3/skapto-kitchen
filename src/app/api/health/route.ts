import { NextResponse } from 'next/server'
import { CalendarEvents } from '@/db/calendar-events'
import xior from 'xior'


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

  if (!healthy) {
    console.warn('Health check failed', { dbOk, apiOk })
  }

  return NextResponse.json(
    { healthy, dbOk, apiOk, timestamp: Date.now() },
    { status: healthy ? 200 : 503 }
  )
}

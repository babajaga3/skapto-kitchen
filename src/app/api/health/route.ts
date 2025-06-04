import { NextResponse } from 'next/server'
import { pb } from '@/lib/pocketbase'

// todo sort of beta
async function checkDatabase() {
  try {
    const data = await pb.collection('calendar_events').getFullList()

    return !!data
  } catch {
    return false
  }
}

async function checkExternalApi() {
  try {
    const res = await fetch(process.env.EXTERNAL_API_CHECK ?? 'https://www.cloudflare.com/cdn-cgi/trace', {
      method: 'HEAD',
      cache: 'no-store',
      signal: AbortSignal.timeout(2000)
    })

    return res.ok
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

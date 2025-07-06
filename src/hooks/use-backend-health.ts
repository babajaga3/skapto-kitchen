// ChatGPT generated
'use client'

import { useEffect, useState } from 'react'


type HealthStatus = {
  data: {
    healthy: boolean
    dbOk: boolean
    apiOk: boolean
    timestamp: number
  }
}

export function useBackendHealth(interval = 10000) {
  const [ status, setStatus ] = useState<HealthStatus['data'] | null>(null)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const ping = async () => {
      try {
        const res = await fetch('/api/health', { cache: 'no-store' })
        const data = await res.json()
        setStatus(data.data) // todo fix, terrible typing
      } catch {
        setStatus({ healthy: false, dbOk: false, apiOk: false, timestamp: Date.now() })
      }

      timeout = setTimeout(ping, interval)
    }

    ping()

    return () => clearTimeout(timeout)
  }, [ interval ])

  return status
}

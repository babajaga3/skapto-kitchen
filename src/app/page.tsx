'use client' // ← Essential: marks this as a Client Component

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'


export default function Home() {
  //* do something with this route later

  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard')
  }, [ router ])

  return null
}

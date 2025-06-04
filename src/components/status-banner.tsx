// ChatGPT generated, perfected by me
'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useBackendHealth } from '@/hooks/use-backend-health'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'


export default function NetworkStatusBanner() {

  /*
   * TODO:
   *  - Exponential backoff for the banner (low priority)
   * */

  // Status state
  const status = useBackendHealth()
  const show = status && !status.healthy
  const [ shouldShow, setShouldShow ] = useState(false)

  // Actively update the component visibility
  useEffect(() => {
    if (show) {
      setShouldShow(true)
    }
  }, [ show ])

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          key="network-banner"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={cn('bg-destructive text-white fixed z-50 top-0 left-0 right-0 text-center text-sm py-2 shadow-md'
            + ' flex items-center justify-items-stretch gap-2')}
        >
          <Button
            variant={'ghost'}
            className={'ml-2 hover:bg-accent-foreground'}
            onClick={() => setShouldShow(false)}
          >
            <X />
          </Button>
          <div className={'self-center'}>
            ⚠️ Service disruption:{' '}
            {!status?.dbOk && 'Database unreachable; '}
            {!status?.apiOk && 'External API; '}
            {' '}(Please check your internet connection)
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

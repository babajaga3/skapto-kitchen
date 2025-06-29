'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { UserMenu } from '@/components/user-menu'
import { useIsMobile } from '@/hooks/use-mobile'
import { Menu, PanelLeft, RefreshCw } from 'lucide-react'
import { useBookingModal } from '@/hooks/use-booking-modal'
import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useKitchen } from '@/hooks/use-kitchen'
import { toast } from 'sonner'
import { usePathname } from 'next/navigation'


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const { toggleSidebar } = useSidebar()
  const { toggleModal } = useBookingModal()
  const { kitchen, kitchenName } = useKitchen()

  const refetchBookings = useCallback(async () => {
    await queryClient.refetchQueries({
      queryKey: [ 'events', 'all', kitchen ]
    })
    toast.info(`Fetched the latest bookings for ${kitchenName} kitchen`)
  }, [ queryClient, kitchen ])

  const reloadButtonAllowedPaths = useMemo(() => [ '/dashboard', '/dashboard/bookings' ], [])

  return (
    <>
      <AppSidebar />

      <main className="flex flex-col flex-1 overflow-hidden">
        {/* Static header/trigger */}
        <div className="flex justify-between items-center p-4 border-b shrink-0">
          {/* Button for opening sidebar/nav drawer */}
          <div className="flex items-center gap-2">

            {/* Open sidebar */}

            <Button variant={isMobile ? 'outline' : 'ghost'} onClick={toggleSidebar}>
              {isMobile ? <Menu /> : <PanelLeft />}
            </Button>

            {/* Refetch bookings (desktop-only) */}

            {!isMobile && reloadButtonAllowedPaths.includes(pathname) && (
              <Button
                variant={'ghost'}
                onClick={refetchBookings}
              >
                <RefreshCw />
              </Button>
            )}

            {/* Create Booking (mobile-only) */}

            {isMobile && <Button variant={'outline'} onClick={toggleModal}>
              Add Booking
            </Button>}
          </div>

          {/* Add the user menu (mobile-only) */}

          {isMobile && <UserMenu isMobile />}
        </div>

        {/* Scrollable calendar area */}
        <div className="flex-1 h-full overflow-hidden p-4 mb-4">
          {children}
        </div>
      </main>
    </>
  )
}

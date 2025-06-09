import { BookingModal } from '@/components/booking-modal'
import { SidebarProvider } from '@/components/ui/sidebar'
import { BookingModalProvider } from '@/providers/booking-modal-provider'
import { KitchenProvider } from '@/providers/kitchen-provider'
import StatusBanner from '@/components/status-banner'


export default function AppLayout({ children }: { children: React.ReactNode }) {

  // Have all custom providers here
  return (
    <BookingModalProvider>
      <KitchenProvider>
        <SidebarProvider className="flex h-screen w-screen overflow-hidden">

          <StatusBanner />

          {children}
          <BookingModal />
        </SidebarProvider>
      </KitchenProvider>
    </BookingModalProvider>
  )
}

import { BookingModal } from '@/components/booking-modal'
import { SidebarProvider } from '@/components/ui/sidebar'
import { BookingModalProvider } from '@/providers/booking-modal-provider'
import { KitchenProvider } from '@/providers/kitchen-provider'


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <BookingModalProvider>
      <KitchenProvider>
        <SidebarProvider className="flex h-screen w-screen overflow-hidden">
          {children}
          <BookingModal />
        </SidebarProvider>
      </KitchenProvider>
    </BookingModalProvider>
  )
}

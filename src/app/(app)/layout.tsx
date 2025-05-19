import { BookingModal } from '@/components/booking-modal'
import { SidebarProvider } from '@/components/ui/sidebar'
import { BookingModalProvider } from '@/providers/booking-modal-provider'


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <BookingModalProvider>
      <SidebarProvider className="flex h-screen w-screen overflow-hidden">
        {children}
        <BookingModal />
      </SidebarProvider>
    </BookingModalProvider>
  )
}

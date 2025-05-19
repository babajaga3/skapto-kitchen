import { BookingModalContext } from '@/providers/booking-modal-provider'
import { useContext } from 'react'


export function useBookingModal() {
  const context = useContext(BookingModalContext)
  if (!context) {
    throw new Error('useBookingModal must be used within a BookingModalProvider.')
  }

  return context
}

'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useBookingModal } from '@/hooks/use-booking-modal'
import { useIsMobile } from '@/hooks/use-mobile'
import { BookingForm } from '@/components/booking-form'


export function BookingModal() {
  const { open, openMobile, toggleModal } = useBookingModal()
  const isMobile = useIsMobile()

  return (
    <Dialog open={isMobile ? openMobile : open} onOpenChange={toggleModal}>
      <DialogContent>

        {/* Header */}

        <DialogHeader>
          <DialogTitle>Create new booking</DialogTitle>
          <DialogDescription>
            Book the kitchen by setting the desired hour and date when you want to do that.
            You may not book the kitchen for more than 2 hours per day.
          </DialogDescription>
        </DialogHeader>

        {/* Form here soon */}

        <BookingForm />

      </DialogContent>
    </Dialog>

  )
}

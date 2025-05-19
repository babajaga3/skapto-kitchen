'use client'

import { CalendarEvents } from '@/db/calendar-events'
import { useBookingModal } from '@/hooks/use-booking-modal'
import { useIsMobile } from '@/hooks/use-mobile'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { useQuery } from '@tanstack/react-query'
import { useKitchen } from '@/hooks/use-kitchen'


export default function Calendar() {
  const isMobile = useIsMobile()
  const { kitchen } = useKitchen()
  const { toggleModal } = useBookingModal()

  const eventsQuery = useQuery({
    queryKey: [ 'events', 'all', kitchen ],
    queryFn: () => CalendarEvents.getAll(`kitchen = '${kitchen}'`),
    select: data => data.map(event => {
      return {
        title: event.studentName,
        start: event.start,
        end: event.end
      }
    })
  })

  return (
    <div className='h-full w-full overflow-auto'>
      <FullCalendar
        timeZone='local'
        events={eventsQuery.data}
        plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
        key={isMobile ? 'mobile' : 'desktop'} // Force re-render so initView expression works below
        initialView={isMobile ? 'timeGridDay' : 'timeGridWeek'}
        height='100%'
        expandRows
        allDaySlot={false}
        nowIndicator
        firstDay={1}
        selectable
        selectConstraint={{
          startTime: '09:00',
          endTime: '22:00'
        }}
        eventOverlap={false}
        slotMinTime={'09:00:00'}
        slotMaxTime={'22:00:00'}
        dayHeaderFormat={{
          weekday: 'short',
          day: '2-digit',
          month: 'short'
        }}
        headerToolbar={{
          left: `prev,next${isMobile ? '' : ' today'}`,
          center: isMobile ? '' : 'addBooking',
          right: `${isMobile ? 'timeGridFourDay' : ''},timeGridDay` /* user can switch between the two */
        }}
        views={{
          timeGridFourDay: {
            type: 'timeGrid',
            duration: { days: 3 },
            buttonText: '3 day'
          }
        }}
        customButtons={{
          addBooking: {
            text: 'Add Booking',
            click: () => {
              toggleModal()
            }
          }
        }}
      />
    </div>
  )
}

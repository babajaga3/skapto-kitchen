'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useIsMobile } from '@/hooks/use-mobile'


export default function Calendar() {
  const isMobile = useIsMobile()
  
  return (
    <div className='h-full w-full overflow-auto'>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
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
        // todo allow only a certain amount of time to be booked at once
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
          center: isMobile ? '' : 'title',
          right: `${isMobile ? 'timeGridFourDay' : 'timeGridWeek'},timeGridDay` /* user can switch between the two*/
        }}
        views={{
          timeGridFourDay: {
            type: 'timeGrid',
            duration: { days: 3 },
            buttonText: '3 day'
          }
        }}
      />
    </div>
  )
}

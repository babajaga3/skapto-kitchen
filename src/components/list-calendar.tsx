'use client'

import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import { useQuery } from '@tanstack/react-query'
import { CalendarEvents } from '@/db/calendar-events'
import { useKitchen } from '@/hooks/use-kitchen'


export function ListCalendar() {
  const { kitchen } = useKitchen()

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
        events={eventsQuery?.data}
        plugins={[ listPlugin ]}
        initialView='listWeek'
        height={'100%'}
      />
    </div>
  )
}

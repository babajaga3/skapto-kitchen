'use client'

import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import { useQuery } from '@tanstack/react-query'
import { CalendarEvents } from '@/db/calendar-events'
import { useKitchen } from '@/hooks/use-kitchen'
import { useIsMobile } from '@/hooks/use-mobile'
import { useCallback, useMemo, useState } from 'react'
import { PBFilters } from '@/lib/pocketbase'


export function ListCalendar() {
  const isMobile = useIsMobile()
  const { kitchen } = useKitchen()
  const [ studentId, setStudentId ] = useState<number>()

  /*
  * TODO:
  *  - Maintain filters after changing kitchen
  *  - Maintain filters after clicking off page (don't maintain for reloading the page)
  * */

  // Filters for the query
  const queryFilters = useMemo(() => {
    return new PBFilters([{ key: 'kitchen', value: kitchen ?? '' }])
  }, [ kitchen ])

  // Query
  const eventsQuery = useQuery({
    queryKey: [ 'events', 'all', kitchen, studentId ],
    queryFn: () => CalendarEvents.getAll(queryFilters.toString()),
    select: data => data.map(event => {
      return {
        title: event.studentName,
        start: event.start,
        end: event.end
      }
    })
  })

  // Function to filter bookings (all and user-only)
  const filterBookings = useCallback((studentId: number | null) => {
    if (studentId !== null) {
      queryFilters.update('studentId', studentId)
      setStudentId(studentId)
    } else {
      queryFilters.remove('studentId')
      setStudentId(undefined)
    }
  }, [ queryFilters ])

  return (
    <div className='h-full w-full overflow-auto'>
      <FullCalendar
        events={eventsQuery?.data}
        plugins={[ listPlugin ]}
        initialView='listWeek'
        height={'100%'}
        headerToolbar={{
          left: isMobile ? 'mine all' : 'title',
          center: !isMobile ? 'mine all' : '',
          right: `${isMobile ? '' : 'today '}prev,next`
        }}
        customButtons={{ // todo figure out better name
          all: {
            text: 'All bookings',
            click: () => filterBookings(null)
          },
          mine: {
            text: 'My bookings',
            click: () => filterBookings(200274715) // todo hardcoded for now, should be dynamic
          }
        }}
      />
    </div>
  )
}

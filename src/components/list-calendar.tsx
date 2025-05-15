'use client'

import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'


export function ListCalendar() {

  return (
    <div className='h-full w-full overflow-auto'>
      <FullCalendar
        plugins={[ listPlugin ]}
        initialView='listWeek'
        height={'100%'}
      />
    </div>
  )
}

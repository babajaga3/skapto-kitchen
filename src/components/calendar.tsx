// In your component
import SchedulerWrapper from '@/components/schedule/_components/view/schedular-view-filteration'
import { SchedulerProvider } from '@/providers/schedular-provider'


export default function Calendar() {
  return (
    <SchedulerProvider weekStartsOn="monday">
      <SchedulerWrapper
        stopDayEventSummary={true}
        classNames={{
          tabs: {
            panel: 'p-0'
          }
        }}
      />
    </SchedulerProvider>
  )
}

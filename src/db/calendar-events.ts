import { db } from '@/db'
import { CalendarEvent, CollectionEntry } from '@/types/calendar-events'


type CreateCalendarEvent = Omit<CalendarEvent, 'id' | 'created' | 'updated'>

export class CalendarEvents {
  private static readonly calendarCollection = db.client.collection<CollectionEntry>('calendar_events')

  public static async getAll(filter?: string): Promise<CollectionEntry[]> {
    const data = await CalendarEvents.calendarCollection.getFullList({
      filter
    })

    return data
  }

  public static async getOne(recordId: string) {
    const data = await CalendarEvents.calendarCollection.getOne(recordId)

    return data
  }

  public static async create(calendarEvent: CreateCalendarEvent) {
    const data = await CalendarEvents.calendarCollection.create<CalendarEvent>(calendarEvent)

    return data
  }

  public static async delete(recordId: string) {
    await CalendarEvents.calendarCollection.delete(recordId)
  }
}

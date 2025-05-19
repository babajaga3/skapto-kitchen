import { pb } from '@/lib/pocketbase'
import { CalendarEvent, CollectionEntry } from '@/types/calendar-events'
import { RecordModel } from 'pocketbase'


// Type for creating calendar event record
type CreateCalendarEvent = Omit<CalendarEvent, 'id' | 'created' | 'updated'>

export class CalendarEvents {
  // Calendar collection var (less boilerplate)
  private static readonly calendarCollection = pb.collection<CollectionEntry>('calendar_events')
  
  // Get all events
  public static async getAll(filter?: string): Promise<CollectionEntry[]> {
    const data = await this.calendarCollection.getFullList({
      filter
    })
    
    return data
  }
  
  // Get one event
  public static async getOne(recordId: string) {
    const data = await this.calendarCollection.getOne(recordId)
    
    return data
  }
  
  // Create an event
  public static async create(calendarEvent: CreateCalendarEvent) {
    const data = await this.calendarCollection.create<CalendarEvent>(calendarEvent)
    
    return data
  }
  
  // Delete an event
  public static async delete(recordId: string) {
    await this.calendarCollection.delete(recordId)
  }
}

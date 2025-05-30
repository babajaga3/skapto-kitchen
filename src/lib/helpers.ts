import { CollectionEntry } from '@/types/calendar-events'
import { DateObjectUnits, DateTime } from 'luxon'


export class BMDates {

  public static fromJSDateToISO(date: Date, utc: boolean = true) {
    return DateTime.fromJSDate(date, { zone: utc ? 'utc' : undefined }).toISO()
  }

  public static fromISOToJSDate(date: string, utc: boolean = true) {
    return DateTime.fromISO(date, { zone: utc ? 'utc' : undefined }).toJSDate()
  }

  public static fromDBToDTObject(date: string) {
    const dt = DateTime.fromSQL(date)

    // Make sure date is valid
    if (!dt.isValid) throw new Error('Invalid ISO string')

    return dt
  }

  public static constructDate(date: string, dateUnits: DateObjectUnits) {
    const dt = DateTime.fromISO(date)

    // Make sure date is valid
    if (!dt.isValid) throw new Error('Invalid ISO string')

    return dt.set(dateUnits).toString()
  }

  public static constructTimeRangeOfDate(date: string, utc: boolean = true) {

    const dt = DateTime.fromISO(date)

    // Make sure date is valid
    if (!dt.isValid) throw new Error('Invalid ISO string')

    // toUTC() needs to come after startOf, so it doesn't mess with zones
    const startOfDate = utc ? dt.startOf('day').toUTC().toISO() : dt.startOf('day').toISO()
    const endOfDate = utc ? dt.endOf('day').toUTC().toISO() : dt.endOf('day').toISO()

    return {
      startOfDate,
      endOfDate
    }
  }

  public static constructDateRangeFromJSDate(initialDate: Date, days: number = 1) {
    const luxonDate = DateTime.fromJSDate(initialDate).startOf('day')
    const today = DateTime.now().startOf('day')
    const endDate = today.plus({ days }).startOf('day')

    return luxonDate < today || luxonDate >= endDate
  }
}

export class BMHours {
  // Initial arrays showing available hours
  public static initStartHourArray = Array.from({ length: 21 - 9 + 1 }, (_, i) => i + 9) // support from 9 till 21
  public static initEndHourArray = Array.from({ length: 23 - 10 + 1 }, (_, i) => i + 9) // support from 10 till 22

  // Hours available
  public static isKitchenAvailable(bookedHours?: Set<number>) {
    const startHourArray = BMHours.getAvailableStartHours(bookedHours)

    return startHourArray.length > 0
  }

  // Extract already booked hours from the selected date
  public static getBookedHours(bookings: CollectionEntry[]) {
    const bookedHours = new Set<number>()

    bookings.forEach(booking => {
      const startHour = BMDates.fromDBToDTObject(booking.start).hour
      const endHour = BMDates.fromDBToDTObject(booking.end).hour

      for (let h = startHour; h < endHour; h++) {
        bookedHours.add(h)
      }
    })

    return bookedHours
  }

  // Filter the starting hours
  public static getAvailableStartHours(bookedHours?: Set<number>) {
    if (!bookedHours) return BMHours.initStartHourArray

    return BMHours.initStartHourArray.filter(hour => {
      return !bookedHours?.has(hour) // Return those that are not in the booked array
    })
  }

  // Filter the ending hours
  public static getAvailableEndHours(bookedHours: Set<number> = new Set(), selectedStart?: number) {
    if (selectedStart === undefined) return []

    // Valid end times are between (start + 1) and (start + 2), inclusive
    const possibleEndHours = BMHours.initEndHourArray.filter(hour => hour > selectedStart && hour <= selectedStart + 2)

    return possibleEndHours.filter(endHour => {
      // We want ALL hours from selectedStart to endHour - 1 to be free
      for (let h = selectedStart; h < endHour; h++) {
        if (bookedHours.has(h)) {
          return false // a conflict
        }
      }

      return true
    })
  }

}

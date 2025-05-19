import { z } from 'zod'
import { DateTime } from 'luxon'
import { Calendar } from '@fullcalendar/core/index.js'
import { RecordModel } from 'pocketbase'


export enum SkaptoKitchens {
  SkaptoOne = 'sk1',
  SkaptoTwoCard = 'sk2c',
  SkaptoTwoKey = 'sk2k',
  SkaptoThree = 'sk3'
}

// ChatGPT'd
export const utcDateZod = z
  .string()
  .refine(val => {
    const dt = DateTime.fromISO(val, { zone: 'utc' })

    return dt.isValid && dt.toISO() === val
  }, {
    message: 'Please select a valid date'
  })

export const zCalendarEvent = z.strictObject({
  // id: z.string().length(15).regex(/^[a-z0-9]+$/), // Auto by pocketbase
  kitchen: z.nativeEnum(SkaptoKitchens),
  studentName: z.string(),
  studentId: z.number().nonnegative().int(),
  start: utcDateZod,
  end: utcDateZod,
  created: utcDateZod,
  updated: utcDateZod
})

export type CalendarEvent = z.infer<typeof zCalendarEvent>

export type CollectionEntry = CalendarEvent & RecordModel

import { z } from 'zod'
import { CalendarEvent, SkaptoKitchens, utcDateZod } from '@/types/calendar-events'

// Form Schema
export const zFormSchema = z.strictObject({
  studentName: z.string().min(1),
  studentId: z
    .number()
    .nonnegative()
    .int()
  // TODO better zod validation (regex?)
    .min(99999999, { message: 'Your ID is 9 digits.' })
    .max(999999999, { message: 'Your ID is 9 digits.' }),
  date: utcDateZod,
  start: z.number().int().min(9).max(21),
  end: z.number().int().min(10).max(22),
  kitchen: z.nativeEnum(SkaptoKitchens)
})
  .refine(
    data => data.end >= data.start,
    {
      message: 'Ending time cannot be before starting time',
      path: [ 'end' ]
    }
  )
  .refine( // Programmable later
    data => data.end <= data.start + 2,
    {
      message: 'Ending time must be within 2 hours after starting',
      path: [ 'end' ]
    }
  )

export type FormSchema = z.infer<typeof zFormSchema>

export type EventPayload = Omit<CalendarEvent, 'id' | 'created' | 'updated'>

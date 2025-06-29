import { z } from 'zod'
import { utcDateZod } from '@/types/calendar-events'


export enum Roles {
  ResidentAssistant = 'resident_assistant',
  Resident = 'resident',
  HallDirector = 'hall_director',
}

export const zUser = z.strictObject({
  id: z.string().regex(/[\da-z]{15}/),
  email: z.string().email(),
  emailVisibility: z.boolean(),
  verified: z.boolean(),
  name: z.string(),
  avatar: z.any(), // todo Fix later
  roles: z.nativeEnum(Roles),
  created: utcDateZod,
  updated: utcDateZod
})

export type User = z.infer<typeof zUser>

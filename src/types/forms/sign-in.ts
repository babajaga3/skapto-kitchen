import { z } from 'zod'


export const zSignInFormSchema = z.strictObject({
  email: z.string().email(),
  password: z.string().min(1, {
    message: 'Password is required.'
  })
})

export type SignInFormSchema = z.infer<typeof zSignInFormSchema>

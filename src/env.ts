import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'


export const env = createEnv({
  client: {
    NEXT_PUBLIC_DATABASE_URL: z.string().url(),
    NEXT_PUBLIC_EXTERNAL_API_CHECK: z.string().url()
  },
  runtimeEnv: {
    NEXT_PUBLIC_DATABASE_URL: process.env.NEXT_PUBLIC_DATABASE_URL,
    NEXT_PUBLIC_EXTERNAL_API_CHECK: process.env.NEXT_PUBLIC_EXTERNAL_API_CHECK
  },
  emptyStringAsUndefined: true
})

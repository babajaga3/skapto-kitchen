import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import PocketBase from 'pocketbase'
import type { User } from '@/types/user'


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function verifyUser(token: string): Promise<{
  isAuthenticated: boolean
  user: User | undefined
}> {
  const pb = new PocketBase('https://skapto-pb.thec0derhere.me')

  let isAuthenticated = false

  if (token) {
    try {
      pb.authStore.loadFromCookie(token)
      await pb.collection('users').authRefresh()
      isAuthenticated = pb.authStore.isValid
    } catch {
      pb.authStore.clear()
    }
  }

  // fixme: fix typing, remove typecast
  return { isAuthenticated, user: pb.authStore.record as unknown as User | undefined }
}

import { useQuery } from '@tanstack/react-query'
import { getSelf } from '@/api'


export function useUser() {
  return useQuery({
    queryKey: [ 'self' ],
    queryFn: getSelf,
    staleTime: Number.POSITIVE_INFINITY, // This keeps the user data fresh indefinitely
    // todo maybe add stale time
    select: data => {
      return data.data
    }
  })
}

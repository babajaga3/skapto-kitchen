import { ReactNode } from 'react'
import { UseQueryResult } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'


type Props<T> = {
  query: UseQueryResult<T>
  children: ReactNode
}

export function QueryStateWrapper<T>({ query, children }: Props<T>) {
  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (query.isError) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-full">
        <p className="text-red-500">Error loading data</p>
        <Button variant="secondary" onClick={() => query.refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  if (query.isSuccess) {
    return <>{children}</>
  }

  return null
}

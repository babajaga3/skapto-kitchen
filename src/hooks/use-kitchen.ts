import { useContext } from 'react'
import { KitchenContext, KitchenContextValue } from '@/providers/kitchen-provider'


export const useKitchen = (): KitchenContextValue => {
  const context = useContext(KitchenContext)
  if (!context) {
    throw new Error('useKitchen must be used within KitchenProvider')
  }

  return context
}

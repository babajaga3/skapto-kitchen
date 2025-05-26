// ChatGPT'd because im too lazy to bother with this context :)
'use client'

import React, { createContext, useCallback, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { SkaptoKitchens } from '@/types/calendar-events'


export interface KitchenContextValue {
  kitchen: SkaptoKitchens | undefined
  setKitchen: (kitchen: SkaptoKitchens) => void
  getKitchen: () => SkaptoKitchens | undefined
}

// eslint-disable-next-line react-refresh/only-export-components
export const KitchenContext = createContext<KitchenContextValue | null>(null)

export const KitchenProvider = ({ children }: { children: React.ReactNode }) => {
  const [ kitchen, setKitchenState ] = useState<KitchenContextValue['kitchen']>(undefined)

  // Fetch Kitchen Cookie and set the state
  useEffect(() => {
    const stored = Cookies.get('main-kitchen') as KitchenContextValue['kitchen']
    if (stored) setKitchenState(stored)
  }, [])

  const setKitchen = useCallback((newKitchen: SkaptoKitchens) => {
    Cookies.set('main-kitchen', newKitchen, { expires: 130 }) // Approx. 1 uni semester todo check later for accurate
    setKitchenState(newKitchen)
  }, [ setKitchenState ])

  const getKitchen = useCallback(() => Cookies.get('main-kitchen') as KitchenContextValue['kitchen'], [])

  return (
    <KitchenContext.Provider value={{ kitchen, setKitchen, getKitchen }}>
      {children}
    </KitchenContext.Provider>
  )
}

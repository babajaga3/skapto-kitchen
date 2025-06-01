// ChatGPT'd because im too lazy to bother with this context :)
'use client'

import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import { SkaptoKitchens } from '@/types/calendar-events'
import { kitchens } from '@/types/skapto-kitchens'


export interface KitchenContextValue {
  kitchen: SkaptoKitchens | undefined
  kitchenName: string | undefined
  setKitchen: (kitchen: SkaptoKitchens) => void
  getKitchen: () => SkaptoKitchens | undefined
}

// eslint-disable-next-line react-refresh/only-export-components
export const KitchenContext = createContext<KitchenContextValue | null>(null)

export const KitchenProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize kitchen state with undefined
  const [ kitchen, setKitchenState ] = useState<KitchenContextValue['kitchen']>(undefined)

  // Fetch Kitchen Cookie and set the state
  useEffect(() => {
    const stored = Cookies.get('main-kitchen') as KitchenContextValue['kitchen']
    if (stored) setKitchenState(stored)
  }, [])

  // Function to set the kitchen state and update the cookie
  const setKitchen = useCallback((newKitchen: SkaptoKitchens) => {
    Cookies.set('main-kitchen', newKitchen, { expires: 130 }) // Approx. 1 uni semester todo check later for accurate
    setKitchenState(newKitchen)
  }, [ setKitchenState ])

  // Function to get the kitchen from cookies
  const getKitchen = useCallback(() => Cookies.get('main-kitchen') as KitchenContextValue['kitchen'], [])

  // Memoize the kitchen name for performance
  const kitchenName = useMemo(() => {
    return Object.entries(kitchens).find(([ _key, value ]) => value === kitchen)?.[0]
  }, [ kitchen ])

  return (
    <KitchenContext.Provider value={{ kitchen, kitchenName, setKitchen, getKitchen }}>
      {children}
    </KitchenContext.Provider>
  )
}

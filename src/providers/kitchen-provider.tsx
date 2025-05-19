// ChatGPT'd because im too lazy to bother with this context :)
'use client'

import React, { createContext, useCallback, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { SkaptoKitchens } from '@/types/calendar-events'


export interface KitchenContextValue {
  kitchen: SkaptoKitchens | undefined
  setKitchen: (kitchen: SkaptoKitchens) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const KitchenContext = createContext<KitchenContextValue | null>(null)

export const KitchenProvider = ({ children }: { children: React.ReactNode }) => {
  const [ kitchen, setKitchenState ] = useState<SkaptoKitchens | undefined>(undefined)

  useEffect(() => {
    const stored = Cookies.get('main-kitchen') as SkaptoKitchens | undefined
    if (stored) setKitchenState(stored)
  }, [])

  const setKitchen = useCallback((newKitchen: SkaptoKitchens) => {
    Cookies.set('main-kitchen', newKitchen, { expires: 365 })
    setKitchenState(newKitchen)
  }, [ setKitchenState ])

  return (
    <KitchenContext.Provider value={{ kitchen, setKitchen }}>
      {children}
    </KitchenContext.Provider>
  )
}

import { SkaptoKitchens } from '@/types/calendar-events'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'


interface KitchenStore {
  kitchen: SkaptoKitchens
  setKitchen: (kitchen: SkaptoKitchens) => void
}

const useKitchenStore = create<KitchenStore>()(persist(
  set => ({
    kitchen: SkaptoKitchens.SkaptoOne,
    setKitchen: kitchen => set({ kitchen })
  }),
  {
    name: 'main-kitchen',
    partialize: state => ({ kitchen: state.kitchen })
  }
))

export const useKitchen = () => useKitchenStore(state => state.kitchen)
export const useSetKitchen = () => useKitchenStore(state => state.setKitchen)

'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ChevronsUpDown, Microwave } from 'lucide-react'
import { skaptos } from '@/types/skapto-kitchens'
import { SkaptoKitchens } from '@/types/calendar-events'
import { useKitchen, useSetKitchen } from '@/stores'


export function SkaptoSelector() {
  const kitchen = useKitchen()
  const setKitchen = useSetKitchen()


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'outline'} className={'group/button flex justify-between h-auto'}>
          <div className="flex items-center gap-2">
            <Microwave className="size-8 dark:text-primary-foreground" />
            <div className="flex flex-col items-start">
              <span className="font-semibold dark:text-primary-foreground">
                Current Kitchen
              </span>
              <span className="text-muted-foreground group-hover/button:text-muted-foreground-hover">
                {skaptos[kitchen]}
              </span>
            </div>
          </div>
          <ChevronsUpDown className='dark:text-primary-foreground' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-(--radix-popper-anchor-width)">
        <DropdownMenuLabel>Select your kitchen</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={kitchen}
          onValueChange={value => setKitchen(value as SkaptoKitchens)}
        >
          {Object.entries(skaptos).map(([ key, value ]) => (
            <DropdownMenuRadioItem key={key} value={key}>{value}</DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

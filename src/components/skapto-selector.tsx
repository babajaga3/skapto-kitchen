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
import { kitchens } from '@/types/skapto-kitchens'
import { SkaptoKitchens } from '@/types/calendar-events'
import { useKitchen } from '@/hooks/use-kitchen'


export function SkaptoSelector() {
  const { kitchen, kitchenName, setKitchen } = useKitchen()


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
                {kitchenName}
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
          {Object.entries(kitchens).map(([ key, value ]) => (
            <DropdownMenuRadioItem key={value} value={value}>{key}</DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

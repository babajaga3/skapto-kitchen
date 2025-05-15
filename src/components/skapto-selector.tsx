'use client'

import * as React from 'react'

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
import { Microwave, ChevronsUpDown } from 'lucide-react'


type SkaptoKey = 'sk1' | 'sk2c' | 'sk2k' | 'sk3'

export function SkaptoSelector() {
  const [ position, setPosition ] = React.useState<SkaptoKey>('sk1')

  const tr: Record<SkaptoKey, string> = {
    sk1: 'Skaptopara I',
    sk2c: 'Skaptopara II (card)',
    sk2k: 'Skaptopara II (key)',
    sk3: 'Skaptopara III'
  }

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
                {tr[position]}
              </span>
            </div>
          </div>
          <ChevronsUpDown className='dark:text-primary-foreground' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-(--radix-popper-anchor-width)">
        <DropdownMenuLabel>Select your kitchen</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* @ts-expect-error stoopid todo fix later */}
        <DropdownMenuRadioGroup value={position} onValueChange={(value: SkaptoKey) => setPosition(value)}>
          <DropdownMenuRadioItem value="sk1">Skaptopara I</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="sk2c">Skaptopara II (card)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="sk2k">Skaptopara II (key)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="sk3">Skaptopara III</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

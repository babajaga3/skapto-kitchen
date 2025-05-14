'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ChevronsUpDown, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'


export function UserMenu() {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className='flex justify-between p-8'>
          <div className='flex flex-row items-center gap-2'>
            <Avatar>
              <AvatarImage src='https://avatars.githubusercontent.com/u/63297306' />
              <AvatarFallback>TB</AvatarFallback>
            </Avatar>
            <span className='flex flex-col items-start'>
              <h3 className=''>Toma Bourov</h3>
              <p className='text-xs text-muted-foreground'>tnb241@aubg.edu</p>
            </span>
          </div>
          <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-(--radix-popper-anchor-width)">
        <DropdownMenuItem>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { Calendar, KeyRound, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { SkaptoSelector } from './skapto-selector'
import { Button } from './ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from './ui/drawer'
import { UserMenu } from './user-menu'


export function AppSidebar() {
  // TODO add sections for RAs and directors (aka roles)

  const { open, isMobile, openMobile, setOpenMobile } = useSidebar()


  if (isMobile) {
    return (
      <Drawer open={openMobile} onOpenChange={setOpenMobile}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle /> {/* Required by the ShadCN component */}
            <SkaptoSelector />
          </DrawerHeader>
          <span className="self-center border-b-2 w-11/12" />
          <DrawerFooter>
            <h4 className='text-sm font-semibold mt-2'>Kitchen</h4>
            <Button asChild variant='outline'>
              <Link href='/dashboard'>
                <Calendar /> Schedule
              </Link>
            </Button>
            <Button asChild variant='outline'>
              <Link href='/dashboard/bookings'>
                <User /> My bookings
              </Link>
            </Button>
            <Button asChild variant='outline'>
              <Link href='/dashboard/settings'>
                <Settings /> Settings
              </Link>
            </Button>

            {/* <h4 className='text-sm font-semibold mt-2'>RA</h4>
            <Button variant='outline'><Settings /> Settings</Button>
            <Button variant='outline'><KeyRound /> Rules</Button>
            <Button variant='outline'><Calendar /> Calendar</Button>

            <h4 className='text-sm font-semibold mt-2'>Director</h4>
            <Button variant='outline'><Calendar /> Booking</Button> */}

            <DrawerClose asChild>
              <Button variant="ghost" className='mt-4'>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className={open ? '' : 'hidden'}>
        <SkaptoSelector />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Kitchen</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={'/dashboard'}>
                    <Calendar />
                    <span>Schedule</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={'/dashboard/bookings'}>
                    <User />
                    <span>My bookings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={'/dashboard/settings'}>
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserMenu sidebarOpen={open} />
      </SidebarFooter>
    </Sidebar>
  )
}

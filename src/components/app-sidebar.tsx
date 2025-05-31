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
import { Calendar, Settings, User } from 'lucide-react'
import { SkaptoSelector } from './skapto-selector'
import { Button } from './ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from './ui/drawer'
import { UserMenu } from './user-menu'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'


export function AppSidebar() {
  // TODO add sections for RAs and directors (aka roles)

  const router = useRouter()
  const { open, isMobile, openMobile, setOpenMobile } = useSidebar()

  const handleNavigation = useCallback((href: string, mobile: boolean = isMobile) => {
    if (mobile) setOpenMobile(false) // Close the mobile drawer if open on mobile
    router.push(href)
  }, [ router, setOpenMobile, isMobile ])


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
            <Button variant='outline' onClick={() => handleNavigation('/dashboard')}>
              <Calendar /> Schedule
            </Button>
            <Button variant='outline' onClick={() => handleNavigation('/dashboard/bookings')}>
              <User /> My bookings
            </Button>
            <Button variant='outline' onClick={() => handleNavigation('/dashboard/settings')}>
              <Settings /> Settings
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
                <SidebarMenuButton onClick={() => handleNavigation('/dashboard')}>
                  <Calendar />
                  <span>Schedule</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleNavigation('/dashboard/bookings')}>
                  <User />
                  <span>My bookings</span>
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
                <SidebarMenuButton onClick={() => handleNavigation('/dashboard/settings')}>
                  <Settings />
                  <span>Settings</span>
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

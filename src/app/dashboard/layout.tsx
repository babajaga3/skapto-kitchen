'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { UserMenu } from '@/components/user-menu'
import { useIsMobile } from '@/hooks/use-mobile'
import { Menu, PanelLeft } from 'lucide-react'


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const { toggleSidebar } = useSidebar()

  return (
    <>
      <AppSidebar />

      <main className="flex flex-col flex-1 overflow-hidden">
        {/* Static header/trigger */}
        <div className="flex justify-between items-center p-4 border-b shrink-0">
          {/* Button for opening sidebar/nav drawer */}
          <Button variant={isMobile ? 'outline' : 'ghost'} onClick={toggleSidebar}>
            {isMobile ? <Menu /> : <PanelLeft />}
          </Button>
          {/* Add the user menu for mobile view */}
          {isMobile && <UserMenu isMobile />}
        </div>

        {/* Scrollable calendar area */}
        <div className="flex-1 h-full overflow-hidden p-4 mb-4">
          {children}
        </div>
      </main>
    </>
  )
}

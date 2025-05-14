'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { Menu, PanelLeft } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const { toggleSidebar } = useSidebar()

  return (
    <>
      <AppSidebar />

      <main className="flex flex-col flex-1 overflow-hidden">
        {/* Static header / trigger */}
        <div className="p-4 border-b shrink-0">
          <Button variant={isMobile ? 'outline' : 'ghost'} onClick={toggleSidebar}>
            {isMobile ? <Menu /> : <PanelLeft />}
          </Button>
        </div>

        {/* Scrollable calendar area */}
        <div className="flex-1 h-full overflow-hidden p-4 mb-4">
          {children}
        </div>
      </main>
    </>
  )
}

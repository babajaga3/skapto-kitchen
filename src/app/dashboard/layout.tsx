import { AppSidebar } from '@/components/app-sidebar'
import Calendar from '@/components/calendar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'


export default function DashboardLayout({ children }: { children: React.ReactNode }) {


  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

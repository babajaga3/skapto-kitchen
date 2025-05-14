import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="flex h-screen w-screen overflow-hidden">
      <AppSidebar />

      <main className="flex flex-col flex-1 overflow-hidden">
        {/* Static header / trigger */}
        <div className="p-4 border-b shrink-0">
          <SidebarTrigger />
        </div>

        {/* Scrollable calendar area */}
        <div className="flex-1 h-full overflow-hidden p-4 mb-4">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}

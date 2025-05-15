import { SidebarProvider } from '@/components/ui/sidebar'


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="flex h-screen w-screen overflow-hidden">
      {children}
    </SidebarProvider>
  )
}

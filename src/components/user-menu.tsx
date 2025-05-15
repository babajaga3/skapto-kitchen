import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ChevronsUpDown, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { motion, AnimatePresence } from 'framer-motion'


export function UserMenu({
  isMobile,
  sidebarOpen
}: { isMobile?: boolean; sidebarOpen?: boolean }) {

  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <div className={'flex flex-row-reverse items-center gap-2'}>
              <Avatar>
                <AvatarImage src='https://avatars.githubusercontent.com/u/63297306' />
                <AvatarFallback>TB</AvatarFallback>
              </Avatar>
              <h3 className=''>Toma Bourov</h3>
            </div>
            <ChevronsUpDown className={'hidden'} />
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          className={`flex items-center justify-between overflow-hidden ${sidebarOpen && 'p-1'} hover:bg-sidebar-primary-foreground transition-all duration-200 rounded-md`}
        >
          <Avatar
            className="shrink-0"
            asChild
          >
            <motion.div layoutId="user-avatar">
              <AvatarImage src="https://avatars.githubusercontent.com/u/63297306" />
              <AvatarFallback>TB</AvatarFallback>
            </motion.div>
          </Avatar>

          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                key="user-info"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="ml-2 flex flex-col items-start"
              >
                <h3 className="font-semibold dark:text-primary-foreground">
                  Toma Bourov
                </h3>
                <p className="text-xs text-muted-foreground">
                  tnb241@aubg.edu
                </p>
              </motion.div>
            )}

            {sidebarOpen && (
              <motion.div
                key="chevron"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-auto"
              >
                <ChevronsUpDown className="size-5 dark:text-primary-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-(--radix-popper-anchor-width)">
        <DropdownMenuItem>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

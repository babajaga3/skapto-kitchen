import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ChevronsUpDown, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'


export function UserMenu({
  isMobile
}: { isMobile?: boolean }) {

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
        <Button variant="outline" className='group/button flex justify-between p-8'>
          <div className='flex flex-row items-center gap-2'>
            <Avatar>
              <AvatarImage src='https://avatars.githubusercontent.com/u/63297306' />
              <AvatarFallback>TB</AvatarFallback>
            </Avatar>
            <span className='flex flex-col items-start'>
              <h3 className='dark:text-primary-foreground'>Toma Bourov</h3>
              <p className='text-xs text-muted-foreground group-hover/button:text-muted-foreground-hover'>tnb241@aubg.edu</p>
            </span>
          </div>
          <ChevronsUpDown className='dark:text-primary-foreground' />
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

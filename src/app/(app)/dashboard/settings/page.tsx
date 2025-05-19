'use client'

import { SettingsItem } from '@/components/settings-item'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'


export default function SettingsPage() {


  return (
    <>
      {/* Section title */}
      <h1 className="text-xl font-bold ">Appearance</h1>

      {/* Section contents (animated) */}
      <motion.div
        key={'appearance-options'}
        className="pt-8 pl-4 flex flex-col items-start gap-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <SettingsItem
          title="Language"
          description="You can change the interface language here"
          item={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={'outline'}>
                  English <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Available languages</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={'sk1'}>
                  <DropdownMenuRadioItem value="sk1">English</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="sk2c">Bulgarian</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="sk2k">Russian</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="sk3">Georgian</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        />

        <SettingsItem
          title="Theme"
          description="You can change the interface theme here (i.e. dark or light)."
          item={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={'outline'}>
                  System <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Themes</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={'sk2c'}>
                  <DropdownMenuRadioItem value="sk1">Light</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="sk2k">Dark</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="sk2c">System</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        />
      </motion.div>
    </>
  )
}

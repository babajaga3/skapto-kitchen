'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import * as React from 'react'


type BookingModalContextProps = {
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleModal: () => void
}

export const BookingModalContext = React.createContext<BookingModalContextProps | null>(null)

export function BookingModalProvider({
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isMobile = useIsMobile()
  const [ openMobile, setOpenMobile ] = React.useState(false)

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [ _open, _setOpen ] = React.useState(false)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }
    },
    [ setOpenProp, open ]
  )

  // Helper to toggle the sidebar.
  const toggleModal = React.useCallback(() => {
    return isMobile ? setOpenMobile(open => !open) : setOpen(open => !open)
  }, [ isMobile, setOpen, setOpenMobile ])

  const contextValue = React.useMemo(
    () => ({
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleModal
    }),
    [ open, setOpen, isMobile, openMobile, setOpenMobile, toggleModal ]
  )


  return (
    <BookingModalContext.Provider value={contextValue}>
      <div
        className={cn(className)}
        {...props}
      >
        {children}
      </div>
    </BookingModalContext.Provider>
  )
}

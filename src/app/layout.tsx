import { Toaster } from '@/components/ui/sonner'
import type { Metadata } from 'next'
import { Open_Sans, Roboto_Slab } from 'next/font/google'
import './globals.css'
import TanstackQueryProvider from '@/providers/tanstack-query'
import { KitchenProvider } from '@/providers/kitchen-provider'


const robotoSlab = Roboto_Slab({
  subsets: [ 'latin' ],
  weight: [ '400', '700' ],
  variable: '--font-heading'
})

const openSans = Open_Sans({
  subsets: [ 'latin' ],
  weight: [ '400', '600' ],
  variable: '--font-body'
})

export const metadata: Metadata = {
  title: 'Skapto Kitchens',
  description: 'Book any skapto kitchen online!'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${robotoSlab.variable} ${openSans.variable} antialiased bg-background`}
      >
        <TanstackQueryProvider>
          {children}
          <Toaster />
        </TanstackQueryProvider>
      </body>
    </html>
  )
}

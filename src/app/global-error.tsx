'use client'

import Image from 'next/image'
import griffon from '../../public/griffon-404.png'
import { Button } from '@/components/ui/button'


export default function GlobalError({
  error
}: {
  error: Error & { digest?: string }
}) {

  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted text-center px-4">
          <div className="max-w-md w-full">
            <Image
              src={griffon}
              alt="Griffon mascot looking confused after spilling food (ChatGPT generated)"
              width={500}
              height={500}
              className="mx-auto mb-6 rounded-lg"
            />

            <h1 className="text-4xl font-bold mb-4 text-foreground">An unexpected error occurred</h1>

            <p className="text-lg text-muted-foreground mb-6">
              Mamma mia.. We really spilled the pasta this time. Here&apos;s the error message: <br />
              <code className="bg-muted p-2 rounded-md text-sm text-red-500">
                {error.message || 'Unknown error'}
              </code>
            </p>

            <p className="text-sm text-muted-foreground">
              If the error persists, please contact{' '}
              <a
                href="mailto:tnb241@aubg.edu"
                className="text-primary underline hover:text-primary/80"
              >
                tnb241@aubg.edu
              </a>
            </p>

            <div className="mt-4 mb-4 flex flex-row gap-2 justify-center">
              <Button
                onClick={() => globalThis.location.reload()}
              >
                Try again
              </Button>

              <Button
                onClick={() => globalThis.location.assign('/')}
              >
                Go back home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

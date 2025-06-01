'use client'

import Image from 'next/image'
import Link from 'next/link'
import griffon from '../../public/griffon-404.png'


export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted text-center px-4">
      <div className="max-w-md w-full">
        <Image
          src={griffon}
          alt="Griffon mascot looking confused after spilling food (ChatGPT generated)"
          width={500}
          height={500}
          className="mx-auto mb-6 rounded-lg"
        />

        <h1 className="text-4xl font-bold mb-4 text-foreground">404 Page not found</h1>

        <p className="text-lg text-muted-foreground mb-6">
          Mamma mia.. Looks like the page you are looking for doesn&apos;t exist.
        </p>

        <p className="text-sm text-muted-foreground">
          If you think this is a mistake, please contact{' '}
          <a
            href="mailto:tnb241@aubg.edu"
            className="text-primary underline hover:text-primary/80"
          >
            tnb241@aubg.edu
          </a>
        </p>

        <Link
          href="/"
          className="mt-6 inline-block bg-primary text-primary-foreground px-5 py-2 rounded-lg shadow hover:bg-primary/90 transition"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}

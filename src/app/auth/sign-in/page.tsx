'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import griffon from '../../../../public/grifon-blue.svg'
import { SignInFormSchema, zSignInFormSchema } from '@/types/forms/sign-in'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { login } from '@/api'


export default function SignInPage() {
  const router = useRouter()
  const form = useForm<SignInFormSchema>({
    resolver: zodResolver(zSignInFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const mutation = useMutation({
    mutationKey: [ 'user', 'login' ],
    mutationFn: async (data: SignInFormSchema) => await login(data.email, data.password),
    onSuccess: () => {
      toast.success('Successfully signed in! Redirecting to the dashboard...')
      /**
       * This is a workaround fix, apparently the router.push() does not work properly on prod
       *
       * https://github.com/vercel/next.js/discussions/51782
       */
      router.refresh() // redirect to the dashboard after successful login
      router.push('/dashboard')
    },
    onError: error => {
      toast.error('There was an error signing you in. Please check your credentials and try again.')
      console.error(error)
    }
  })

  async function onSubmit(data: SignInFormSchema) {
    mutation.mutate(data)
  }

  return (

    <div className="h-screen flex flex-row-reverse gap-12 items-center justify-center">
      <Image
        className="hidden lg:block dark:fill-red-500"
        src={griffon}
        alt='AUBG Griffon'
        priority
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>You need to sign in with your AUBG login to book kitchens</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="tnb241" {...field} />
                    </FormControl>
                    <FormDescription>
                      These are the characters before @aubg.edu
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="•••••••••••" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your AUBG password
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit">Log in</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

    </div>
  )
}

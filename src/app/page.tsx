'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { SkaptoKitchens } from '@/types/calendar-events'
import { kitchens } from '@/types/skapto-kitchens'
import { zodResolver } from '@hookform/resolvers/zod'
import { redirect } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import Cookies from 'js-cookie'


export default function Home() {
  const zFormSchema = z.strictObject({
    kitchen: z.nativeEnum(SkaptoKitchens)
  })

  type FormSchema = z.infer<typeof zFormSchema>

  const form = useForm<FormSchema>({
    resolver: zodResolver(zFormSchema),
    defaultValues: {
      kitchen: SkaptoKitchens.SkaptoOne
    }
  })

  function onSubmit(values: FormSchema) {
    Cookies.set('main-kitchen', values.kitchen) // on device basis for now
    toast('Sucessfully set your kitchen. Enjoy!') // nice message
    redirect('/dashboard') // redirect user to the main dashboard page
  }

  return (
    <div className="h-screen flex flex-col gap-8 self-center justify-center items-center">
      <div className="flex flex-col items-center gap-2">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Select your Skapto kitchen</h3>
        <p className="text-sm text-muted-foreground mx-12 sm:mx-0">
          Choose the Skapto where you will be cooking the most. Don&apos;t worry, you can change this later!
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="kitchen"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select {...field} value={field.value} onValueChange={field.onChange} >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select kitchen" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(kitchens).map(([ key, value ]) => (
                        <SelectItem key={key} value={value}>{key}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className='mt-8 w-full' type="submit">
            Next
          </Button>
        </form>
      </Form>

    </div>
  )
}

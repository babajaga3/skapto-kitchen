'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import Link from 'next/link'


export default function Home() {
  const FormSchema = z.object({
    resHall: z.enum([ 'sk1', 'sk2', 'sk3' ], {
      errorMap: () => ({
        message: 'Please select a valid Skapto.'
      })
    })
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  })

  return (
    <div className="h-screen flex flex-col gap-8 self-center justify-center items-center">
      <div className="flex flex-col items-center gap-2">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Select your Skapto</h3>
        <p className="text-sm text-muted-foreground mx-12 sm:mx-0">
          Choose the Skapto where you will be cooking the most. Don't worry, you can change this later!
        </p>
      </div>
      <Form {...form}>
        <FormField
          control={form.control}
          name="resHall"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Username</FormLabel> */}
              <FormControl>
                <Select {...field} >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Skapto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sk1">Skaptopara I</SelectItem>
                    <SelectItem value="sk2">Skaptopara II</SelectItem>
                    <SelectItem value="sk3">Skaptopara III</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              {/* <FormDescription>This is your public display name.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button asChild type="submit">
          <Link href={'/dashboard'}>
            Next
          </Link>
        </Button>

      </Form>

    </div>
  )
}

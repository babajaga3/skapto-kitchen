'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { useBookingModal } from '@/hooks/use-booking-modal'
import { useIsMobile } from '@/hooks/use-mobile'
import { pb } from '@/lib/pocketbase'
import { cn } from '@/lib/utils'
import { CalendarEvent, SkaptoKitchens, utcDateZod } from '@/types/calendar-events'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react'
import { DateTime } from 'luxon'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'
import { Input } from './ui/input'


export function BookingModal() {
  const { open, setOpen } = useBookingModal()
  const isMobile = useIsMobile()
  const queryClient = useQueryClient()

  // Form Schema
  const formSchema = z.strictObject({
    studentName: z.string().min(1),
    studentId: z
      .number()
      .nonnegative()
      .int()
      .min(99999999, { message: 'Your ID is 9 digits.'})
      .max(999999999, { message: 'Your ID is 9 digits.'}),
    date: utcDateZod,
    start: z.number().int().min(9).max(20),
    end: z.number().int().min(10).max(22),
    kitchen: z.nativeEnum(SkaptoKitchens)
  })
    .refine(
      data => data.end >= data.start,
      {
        message: 'Ending time cannot be before starting time',
        path: [ 'end' ]
      }
    )
    .refine(
      data => data.end <= data.start + 2,
      {
        message: 'Ending time must be within 2 hours after starting',
        path: [ 'end' ]
      }
    )

  type FormSchema = z.infer<typeof formSchema>
  type EventPayload = Omit<CalendarEvent, 'id' | 'created' | 'updated'>

  // Define form
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: '',
      studentId: undefined,
      // kitchen: SkaptoKitchens.SkaptoOne // or some default
    }
    // todo add default values if user selects directly in calendar
  })

  // On submit handler
  function onSubmit(values: FormSchema) {
    
    // Construct start & end db strings
    const start = DateTime
      .fromISO(values.date)
      .set({ hour: values.start, minute: 0, second: 0, millisecond: 0})
      .toString()
    const end = DateTime
      .fromISO(values.date)
      .set({ hour: values.end, minute: 0, second: 0, millisecond: 0 })
      .toString()
  
    const payload: EventPayload = {
      ...values,
      start,
      end
    }
    
    mutation.mutate(payload)
  }

  // React query mutation
  const mutation = useMutation({
    mutationKey: [ 'events', 'create', form.getValues().studentId ], // maybe change the unique identifier
    mutationFn: (values: EventPayload) => pb.collection('calendar_events').create<CalendarEvent>(values),
    onSuccess: () => {
      toast('Your booking was successfully created!')
      setOpen(false)
    },
    onError: () => {
      toast('Something went wrong creating your booking.', {
        description: 'Please try again later. If the issue persists, feel free to contact "tnb241@aubg.edu" at any time.'
      })
    },
    onSettled: () => {
      form.reset()
      queryClient.invalidateQueries()
    }
  })

  // Hour array
  const startHourArray = Array.from({ length: 21 - 9 + 1 }, (_, i) => i + 9) // support from 9 till 21
  const endHourArray = Array.from({ length: 23 - 10 + 1 }, (_, i) => i + 9) // support from 10 till 22
  
  // Kitchens
  const kitchens = {
    'Skapto 1': SkaptoKitchens.SkaptoOne,
    'Skapto 2 (card)': SkaptoKitchens.SkaptoTwoCard,
    'Skapto 2 (key)': SkaptoKitchens.SkaptoTwoKey,
    'Skapto 3': SkaptoKitchens.SkaptoThree
  }

  console.log(form.getValues())

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>

        {/* Header */}

        <DialogHeader>
          <DialogTitle>Create new booking</DialogTitle>
          <DialogDescription>
            Book the kitchen by setting the desired hour and date when you want to do that.
            You may not book the kitchen for more than 2 hours per day.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Kitchen */}

            <FormField
              control={form.control}
              name="kitchen"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Kitchen</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? Object.entries(kitchens).find(([_, value]) => value === field.value)?.[0]
                            : "Select kitchen"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {Object.entries(kitchens).map(([key, value], index) => (
                              <CommandItem
                                value={value}
                                key={index}
                                onSelect={() => {
                                  form.setValue("kitchen", value)
                                }}
                              >
                                {key}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the kitchen you will be booking.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Presumably this is taken from the login information */}
            {/* Student name */}

            <FormField
              control={form.control}
              name='studentName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name..." {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name on your student ID.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Student ID */}

            <FormField
              control={form.control}
              name='studentId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      pattern="\d*"
                      placeholder="Your student ID..."
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                        // Only allow digits, and convert to number if not empty
                        const numericValue = value === '' ? undefined : Number(value)
                        field.onChange(numericValue)
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the number on your student ID.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Calendar */}

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of booking</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={DateTime.fromISO(field.value).toJSDate()}
                        onSelect={newDate => {
                          if (newDate) field.onChange(DateTime.fromJSDate(newDate).toUTC().toString())
                        }}
                        disabled={date =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the date you will book the kitchen on.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex flex-col items-start gap-8 sm:flex-row sm:items-center'>
              {/* Starting time */}

              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Starting time</FormLabel>
                    <Popover modal={true}>
                      
                      {/* Trigger button */}
                      
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-[200px] justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? (
                                <>
                                  {startHourArray.find(hour => hour === field.value)?.toString().padStart(2, '0')}:00
                                </>
                              )
                              : 'Select starting time'}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      
                      {/* Hour list */}
                      
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          {!isMobile && <CommandInput
                            placeholder="Search time..."
                            className="h-9"
                          />}
                          <CommandList>
                            <CommandEmpty>No hours available</CommandEmpty>
                            <CommandGroup>
                              
                              {/* Hour list item */}
                              
                              {startHourArray.map(hour => (
                                <CommandItem
                                  value={hour.toString()}
                                  key={hour}
                                  onSelect={() => {
                                    form.setValue('start', hour)
                                    form.setValue('end', hour + 1)
                                  }}
                                >
                                  {hour.toString().padStart(2, '0')}:00
                                  <Check
                                    className={cn(
                                      'ml-auto',
                                      hour === field.value ? 'opacity-100' : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Time when your booking starts.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ending time */}

              <FormField
                control={form.control}
                name="end"
                render={({ field }) => {
                  // Make sure you can set the end time at valid times only
                  const start = form.watch('start')
                  const filteredEndArray = endHourArray.filter(
                    hour => start !== undefined && hour > start && hour <= start + 2
                  )

                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ending time</FormLabel>
                      <Popover>
                        
                        {/* Trigger button */}
                        
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-[200px] justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? `${field.value.toString().padStart(2, '0')}:00`
                                : 'Select ending time'}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        
                        {/* Hour list */}
                        
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            {!isMobile && (
                              <CommandInput
                                placeholder="Search time..."
                                className="h-9"
                              />
                            )}
                            <CommandList>
                              <CommandEmpty>{!start ? 'Please select a starting time first.' : 'No valid times'}</CommandEmpty>
                              <CommandGroup>
                                
                                {/* Hour item component */}
                                
                                {filteredEndArray.map((hour) => (
                                  <CommandItem
                                    value={hour.toString()}
                                    key={hour}
                                    onSelect={() => form.setValue('end', hour)}
                                  >
                                    {hour.toString().padStart(2, '0')}:00
                                    <Check
                                      className={cn(
                                        'ml-auto',
                                        hour === field.value ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Time when your booking ends.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

            </div>

            {/* Submit button */}

            <Button type="submit">Submit</Button>
          </form>
        </Form>

      </DialogContent>
    </Dialog>

  )
}

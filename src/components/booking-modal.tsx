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
import { cn } from '@/lib/utils'
import { CalendarEvent, SkaptoKitchens, utcDateZod } from '@/types/calendar-events'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react'
import { DateTime } from 'luxon'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'
// import { Input } from './ui/input'
import { CalendarEvents } from '@/db/calendar-events'
import { BMDates, BMHours } from '@/lib/helpers'
import { useMemo } from 'react'
import Cookies from 'js-cookie'


export function BookingModal() {
  const { open, setOpen } = useBookingModal()
  const isMobile = useIsMobile()
  const queryClient = useQueryClient()

  const defaultKitchen = useMemo(() => Cookies.get('main-kitchen'), [])

  // Form Schema
  const zFormSchema = z.strictObject({
    studentName: z.string().min(1),
    studentId: z
      .number()
      .nonnegative()
      .int()
      .min(99999999, { message: 'Your ID is 9 digits.' })
      .max(999999999, { message: 'Your ID is 9 digits.' }),
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
    .refine( // Programmable later
      data => data.end <= data.start + 2,
      {
        message: 'Ending time must be within 2 hours after starting',
        path: [ 'end' ]
      }
    )

  type FormSchema = z.infer<typeof zFormSchema>
  type EventPayload = Omit<CalendarEvent, 'id' | 'created' | 'updated'>

  // Define form
  const form = useForm<FormSchema>({
    resolver: zodResolver(zFormSchema),
    defaultValues: {
      studentName: 'Toma Bourov',
      studentId: 200274715,
      date: DateTime.now().startOf('day').toUTC().toISO(), // Use today as default
      kitchen: defaultKitchen ?? SkaptoKitchens.SkaptoOne
    }
    // todo add default values if user selects directly in calendar
  })

  // On submit handler
  function onSubmit(values: FormSchema) {

    // Construct start & end db strings
    const start = BMDates.constructDate(values.date, { hour: values.start })
    const end = BMDates.constructDate(values.date, { hour: values.end })

    const payload = {
      ...values,
      start,
      end
    }

    mutation.mutate(payload)
  }

  // React query mutation
  const mutation = useMutation({
    mutationKey: [ 'events', 'create', form.getValues().studentId ], // maybe change the unique identifier
    mutationFn: (values: EventPayload) => CalendarEvents.create(values),
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

  // Use appropriate dates for filter
  const { startOfDate, endOfDate } = BMDates.constructTimeRangeOfDate(form.watch('date'))

  // Construct filter
  const filter = `start >= "${startOfDate}" && end <= "${endOfDate}"`

  const { data } = useQuery({
    queryKey: [ 'events', 'all', startOfDate ],
    queryFn: () => CalendarEvents.getAll(filter),
    enabled: !!form.watch('date'), // Call only if a date has been selected
    select: bookings => {
      return {
        bookings,
        bookedHours: BMHours.getBookedHours(bookings)
      }
    }
  })

  const bookedHours = data?.bookedHours

  // Kitchens todo make dynamic from db
  const kitchens = {
    'Skapto 1': SkaptoKitchens.SkaptoOne,
    'Skapto 2 (card)': SkaptoKitchens.SkaptoTwoCard,
    'Skapto 2 (key)': SkaptoKitchens.SkaptoTwoKey,
    'Skapto 3': SkaptoKitchens.SkaptoThree
  }

  // console.log(form.getValues())

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
                            'w-[200px] justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? Object.entries(kitchens).find(([ _, value ]) => value === field.value)?.[0]
                            : 'Select kitchen'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {Object.entries(kitchens).map(([ key, value ], index) => (
                              <CommandItem
                                value={value}
                                key={index}
                                onSelect={() => {
                                  form.setValue('kitchen', value)
                                }}
                              >
                                {key}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    value === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
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

            {/* <FormField
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
            /> */}

            {/* Student ID */}

            {/* <FormField
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
            /> */}

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
                            format(field.value, 'PPP') // todo Use luxon here later
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
                        selected={BMDates.fromISOToJSDate(field.value)}
                        onSelect={newDate => {
                          if (newDate) {
                            // Reset times, since other dates might not have the same schedule
                            form.resetField('start')
                            form.resetField('end')

                            // Update new date of reservation
                            field.onChange(BMDates.fromJSDateToISO(newDate))
                          }
                        }}
                        disabled={date => BMDates.constructDateRangeFromJSDate(date, 2)}
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

            {BMHours.isKitchenAvailable(bookedHours) ? (
              <div className='flex flex-col items-start gap-8 sm:flex-row sm:items-center'>
                {/* Starting time */}

                <FormField
                  control={form.control}
                  name="start"
                  render={({ field }) => {
                    const startHourArray = BMHours.getAvailableStartHours(bookedHours)

                    return (
                      (
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
                      )
                    )
                  }}
                />

                {/* Ending time */}

                <FormField
                  control={form.control}
                  name="end"
                  render={({ field }) => {
                    // Make sure you can set the end time at valid times only
                    const start = form.watch('start')
                    const filteredEndArray = BMHours.getAvailableEndHours(bookedHours, start)

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

                                  {filteredEndArray.map(hour => (
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
            ) : (
              <div className='text-base font-semibold px-4'>
                Sorry, this kitchen is fully booked today.
                Try again later, or check the others for availability :)
              </div>
            )}

            {/* Submit button */}

            <Button type="submit">Submit</Button>
          </form>
        </Form>

      </DialogContent>
    </Dialog>

  )
}

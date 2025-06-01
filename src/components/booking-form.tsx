import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { kitchens } from '@/types/skapto-kitchens'
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { DateTime } from 'luxon'
import { Calendar } from '@/components/ui/calendar'
import { BMDates, BMHours } from '@/lib/helpers'
import { useBookingModal } from '@/hooks/use-booking-modal'
import { useIsMobile } from '@/hooks/use-mobile'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useKitchen } from '@/hooks/use-kitchen'
import { useForm } from 'react-hook-form'
import { EventPayload, FormSchema, zFormSchema } from '@/types/forms/booking-modal'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarEvents } from '@/db/calendar-events'
import { toast } from 'sonner'
import { Spinner } from '@/components/spinner'


export function BookingForm() {

  // Hooks
  const { toggleModal } = useBookingModal()
  const isMobile = useIsMobile()
  const queryClient = useQueryClient()
  const { kitchenName, getKitchen } = useKitchen()

  // Define form
  const form = useForm<FormSchema>({
    resolver: zodResolver(zFormSchema),
    defaultValues: {
      studentName: 'Toma Bourov', // Mock data
      studentId: 200274715, // Mock data
      date: DateTime.now().startOf('day').toUTC().toISO(), // Use today as default
      kitchen: getKitchen()
    }
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
      toggleModal()
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
  const filter = `start >= "${startOfDate}" && end <= "${endOfDate}" && kitchen = "${form.watch('kitchen')}"`

  // Fetch current events
  const { data } = useQuery({
    queryKey: [ 'events', 'all', startOfDate, form.watch('kitchen') ],
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

  return (
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
                        ? kitchenName
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
                              // Reset times when changing kitchen
                              form.resetField('start')
                              form.resetField('end')

                              // Set kitchen value
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
              <Popover modal>

                {/* Trigger */}

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
                        DateTime
                          .fromISO(field.value)
                          .toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                {/* Calendar content */}

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
        // Kitchen is fully booked

          <div className='text-base font-semibold px-4'>
            Sorry, this kitchen is fully booked today.
            Try again later, or check the others for availability :)
          </div>
        )}

        {/* Submit button */}

        <Button
          className={'w-full'}
          type="submit"
          disabled={mutation.isPending}
        >
          {!mutation.isPending ? 'Submit' : <Spinner />}
        </Button>
      </form>
    </Form>
  )
}

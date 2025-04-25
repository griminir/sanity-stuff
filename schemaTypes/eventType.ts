import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
import {DoorsOpenInput} from './components/DoorsOpen'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'details', title: 'Details'},
    {name: 'editorial', title: 'Editorial'}
  ],
  fields:[
    defineField({
      name: 'name',
      group: ['details', 'editorial'],
      type: 'string',
    }),
    defineField({
      name: 'slug',
      group: 'details',
      type: 'slug',
      options: {
        source: 'name'
      },
      validation: (rule) => rule.required().error(`required to generate website`),
      hidden: ({document}) => !document?.name
    }),
    defineField({
      name: 'eventType',
      group: 'details',
      type: 'string',
      options: {
        list: ['in-person', 'virtual'],
        layout: 'radio'
      },
        initialValue: 'in-person',
      validation: (rule) => rule.custom((value, context)  => {
        if (context?.document?.venue && value === 'virtual') {
          return `You cannot select "virtual" if it's at a venue`;
        }
        return true;
      })
    }),
    defineField({
      name: 'date',
      group: 'details',
      type: 'datetime'
    }),
    defineField({
      name: 'doorsOpen',
      group: 'details',
      description: 'numbers of minutes before the event',
      type: 'number',
      initialValue: 60,
      components: {
        input: DoorsOpenInput
      }
    }),
    defineField({
      name: 'venue',
      group: 'details',
      type: 'reference',
      to: [{type: 'venue'}],
      validation: (rule) => rule.custom((value, context)  => {
        if (value && context?.document?.eventType === 'virtual') {
          return 'only in-person events can have a venue'
        }
        return true;
      }),
      hidden: (context) => context?.document?.eventType === 'virtual',
      // readOnly: ({value, document}) => !value && document?.eventType === 'virtual'
    }),
    defineField({
      name: 'headline',
      group: 'details',
      type: 'reference',
      to: [{type: 'artist'}]
    }),
    defineField({
      name: 'image',
      group: 'editorial',
      type: 'image'
    }),
    defineField({
      name: 'details',
      group: 'editorial',
      type: 'array',
      of: [{type: 'block'}]
    }),
    defineField({
      name: 'ticket',
      group: 'details',
      type: 'url'
    }),
  ],
  preview: {
    select: {
      name: 'name',
      venue: 'venue.name',
      artist: 'artist.name',
      date: 'date',
      image: 'image'
    },
    prepare({name, venue, artist, date, image}){
      const nameFormatted = name || 'Untitled event'
      const dateFormatted = date ? new Date(date).toLocaleDateString('no', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }) : 'No Date'

      return {
        title: artist ? `${nameFormatted} (${artist})`: nameFormatted,
        subtitle: venue ? `${dateFormatted} at ${venue}` : dateFormatted,
        media: image || CalendarIcon
      }
    }
  }
})
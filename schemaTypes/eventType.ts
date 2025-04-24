import {defineField, defineType} from 'sanity'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields:[
    defineField({
      name: 'name',
      type: 'string'
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name'
      },
      validation: (rule) => rule.required().error(`required to generate website`),
      hidden: ({document}) => !document?.name
    }),
    defineField({
      name: 'eventType',
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
      type: 'datetime'
    }),
    defineField({
      name: 'doorsOpen',
      description: 'numbers of minutes before the event',
      type: 'number',
      initialValue: 60
    }),
    defineField({
      name: 'venue',
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
      type: 'reference',
      to: [{type: 'artist'}]
    }),
    defineField({
      name: 'image',
      type: 'image'
    }),
    defineField({
      name: 'details',
      type: 'array',
      of: [{type: 'block'}]
    }),
    defineField({
      name: 'ticket',
      type: 'url'
    }),
  ]
})
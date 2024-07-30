'use client'

import type { CardProps } from '@nextui-org/react'

import React from 'react'
import { Button, Card, Image, CardBody } from '@nextui-org/react'
import { Icon } from '@iconify/react'

export default function TeamMember (props: CardProps) {
  return (
    <Card className='w-full ' {...props}>
      <Button
        isIconOnly
        className='absolute right-2 top-2 z-20'
        radius='full'
        size='sm'
        variant='light'
      >
        <Icon className='text-red-500' icon='iconamoon:trash-thin' width={24} />
      </Button>
      <CardBody className='flex flex-row flex-wrap p-0 sm:flex-nowrap'>
        <Image
          removeWrapper
          alt='Acme Creators'
          className='h-auto w-full flex-none object-cover object-top max-w-20'
          src='https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/hero-card-complete.jpeg'
        />
        <div className='px-4 py-5'>
          <h3 className='text-large font-medium'>Jane Doe</h3>
          <div className='flex flex-col gap-3 pt-2 text-small text-default-400'>
            <p>
              Visit creators.acme.com to sign up today and start earning credits
              from your fans and followers.
            </p>
            <p>Acme supports YouTube, Twitch, Vimeo and more!</p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

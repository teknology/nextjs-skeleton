'use client'

import React from 'react'
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tabs,
  Tab,
  AvatarGroup,
  Avatar,
  Chip,
  Tooltip,
  ScrollShadow,
  Divider,
  Input,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image
} from '@nextui-org/react'
import { Icon } from '@iconify/react'
import * as actions from '@/actions'
import NotificationsCard from '@/app/components/myaccount/notification-card'
import { useSession } from 'next-auth/react'

export default function myAccount () {
  //const session = useSession()
  //console.log(session)

  return (
    <>
      <header className='mb-6 flex w-full items-center justify-between'>
        <div className='flex flex-col'>
          <Icon
            className='text-primary'
            icon='bx:bx-home'
            width={24}
            height={24}
          />
          <h1 className='text-xl font-bold text-default-900 lg:text-3xl'>
            Account Home
          </h1>
          <p className='text-small text-default-400 lg:text-medium'>
            Manage your account and websites
          </p>
        </div>
        <Button
          color='primary'
          startContent={
            <Icon
              className='flex-none text-current'
              icon='lucide:plus'
              width={16}
            />
          }
        >
          New Deployment
        </Button>
      </header>
      <ScrollShadow
        hideScrollBar
        className='mx-2 flex w-full  gap-8'
        orientation='horizontal'
      ></ScrollShadow>
    </>
  )
}

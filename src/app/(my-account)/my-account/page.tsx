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
import MarketingCard from '@/app/components/myaccount/common/marketing-card'
import TeamMember from '@/app/components/myaccount/team-member'

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
      >
        <div className='flex w-full flex-col'>
          <Tabs aria-label='Options' color='primary'>
            <Tab key='account_home' title='Account Home'>
              {/* TODO: Create an notifications Feature that allows for CTA Cards or informational cards*/}
              <Card>
                <CardBody>
                  <MarketingCard />
                </CardBody>
              </Card>
            </Tab>
            <Tab key='websites' title='Websites'>
              <Card>
                <CardBody>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur.
                </CardBody>
              </Card>
            </Tab>
            <Tab key='team' title='Team'>
              <Card>
                <CardBody>
                  {/* Add the feature to invite, add, edit, delete, team members*/}
                  <TeamMember />
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </ScrollShadow>
    </>
  )
}

'use client'

import React from 'react'
import {
  Button,
  Tabs,
  Tab,
  ScrollShadow,
  Avatar, Spacer, Tooltip, useDisclosure
} from '@nextui-org/react'
import { Icon } from '@iconify/react'
import * as actions from '@/actions'
import { AcmeIcon } from '@/app/components/icons'
import { useSession } from 'next-auth/react'
import ProfileSetting from '@/app/components/myaccount/settings/profile-setting'
import AppearanceSetting from '@/app/components/myaccount/settings/appearance-setting'
import AccountSetting from '@/app/components/myaccount/settings/account-setting'
import BillingSetting from '@/app/components/myaccount/settings/billing-setting'
import TeamSetting from '@/app/components/myaccount/settings/team-setting'

interface Props {
  key?: string
}

export default function Settings() {
  const { isOpen, onOpenChange } = useDisclosure();
  const session = useSession()
  console.log(session)
  const handleAction = (key: string) => {
    switch (key) {
      case 'settings':
        console.log('Team settings')
        break
      case 'billing':
        console.log(key)
        break
      case 'help_and_feedback':
        console.log(key)
        break
      case 'logout':
        // Add your logout logic here
        console.log('User logged out')
        break
      default:
        console.log('Unknown action')
    }
  }
  return (
    <>
      <header className='mb-6 flex w-full items-center justify-between'>
        <div className='flex flex-col'>
          <Icon
            className='text-primary'
            icon='fluent:settings-32-light'
            width={24}
            height={24}
          />
          <h1 className='text-xl font-bold text-default-900 lg:text-3xl'>
            Settings
          </h1>
          <p className='text-small text-default-400 lg:text-medium'>
            Manage your profile, team and billing
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
        className='-mx-2 flex w-full justify-between gap-8'
        orientation='horizontal'
      >
        <div className="w-full flex-1 p-4">
          {/* Title */}
          <div className="flex items-center gap-x-3">
            <Button isIconOnly className="sm:hidden" size="sm" variant="flat" onPress={onOpenChange}>
              <Icon
                className="text-default-500"
                icon="solar:sidebar-minimalistic-linear"
                width={20}
              />
            </Button>
          </div>
          {/*  Tabs */}
          <Tabs
            fullWidth
            classNames={{
              base: "mt-6",
              cursor: "bg-content1 dark:bg-content1",
              panel: "w-full p-0 pt-4",
            }}
          >
            <Tab key="profile" title="Profile">
              <ProfileSetting />
            </Tab>
            <Tab key="appearance" title="Appearance">
              <AppearanceSetting />
            </Tab>
            <Tab key="account" title="Account">
              <AccountSetting />
            </Tab>
            <Tab key="billing" title="Billing">
              <BillingSetting />
            </Tab>
            <Tab key="team" title="Team">
              <TeamSetting />
            </Tab>
          </Tabs>
        </div>

      </ScrollShadow >
    </>
  )
}

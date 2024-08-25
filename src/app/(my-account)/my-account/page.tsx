
import React from 'react'
import {
  Button,
  ScrollShadow,
} from '@nextui-org/react'
import { Icon } from '@iconify/react'
import * as actions from '@/actions'
import NotificationsCard from '@/app/components/myaccount/notification-card'
import { auth } from "@/auth"
'@/app/components/myaccount/account-tabs'
import MyAccountHeader from '@/app/components/myaccount/common/my-account-header'
import MessageNotification from '@/app/components/common/message-notification'
import AlertComponent from '@/app/components/common/alerts'
import AccountTabs from '@/app/components/myaccount/account-tabs'


export default async function myAccount() {
  const session = await auth()
  //console.log(session)
  const pageTitle = 'Account Home';
  const pageSubtitle = 'Manage your account and websites';
  const pageIcon = 'bx:bx-home';

  return (
    <>
      <AlertComponent />
      <MyAccountHeader pageTitle={pageTitle} pageSubtitle={pageSubtitle} pageIcon={pageIcon} />


      <ScrollShadow
        hideScrollBar
        className='mx-2 flex w-full  gap-8'
        orientation='horizontal'
      >
        <div className='flex w-full flex-col'>

          <AccountTabs />

        </div>
      </ScrollShadow>
    </>
  )
}


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
import { useTheme } from 'next-themes'
import { getInitialTheme, setThemeCookie } from '@/utils/theme-utils'
import { getTranslations } from 'next-intl/server';
import { set } from 'zod'
import { cookies } from 'next/headers'



export default async function myAccount() {
  const session = await auth();
  const initialTheme = await getInitialTheme();

  console.log('initial theme:', initialTheme);

  if (!session) {
    // Handle the case where session is null
    return <div>Error: Unable to retrieve session.</div>;
  }


  const t = await getTranslations('my_account');

  // Translation hook
  const pageTitle = t('page_title');
  const pageSubtitle = t('page_subtitle');
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

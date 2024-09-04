
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
interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  theme: string;
}


export default async function myAccount() {
  const session = await auth();

  if (!session) {
    // Handle the case where session is null
    return <div>Error: Unable to retrieve session.</div>;
  }


  const t = await getTranslations('my_account');
  console.log('session:', session)
  // Translation hook
  const pageTitle = t('page_title');
  const pageSubtitle = t('page_subtitle');
  const pageIcon = 'bx:bx-home';

  const cookieTheme = getInitialTheme()

  if ((session.user as User).theme !== cookieTheme) {
    setThemeCookie((session.user as User).theme);
  }


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

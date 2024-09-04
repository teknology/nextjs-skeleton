'use client'
import { Icon } from '@iconify/react'
import {
    Button,
    ScrollShadow,
} from '@nextui-org/react'
import Breadcrumbs from '@/app/components/common/breadcrumbs';
import SiteBreadcrumbs from '@/app/components/common/breadcrumbs';
import myAccount from '@/app/(my-account)/my-account/page';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface MyAccountProps {
    pageTitle: string;
    pageSubtitle: string;
    pageIcon: string;
}

export default function MyAccountHeader({ pageTitle, pageSubtitle, pageIcon }: MyAccountProps) {

    const t = useTranslations('my_account');


    return (
        <div className='mb-6 flex w-full items-center justify-between'>
            <div>
                <div className='flex items-center'>
                    <Icon
                        className='text-primary mr-2'
                        icon={pageIcon}
                        width={24}
                        height={24}
                    />
                    <h1 className='text-xl font-bold text-default-900 lg:text-3xl'>
                        {pageTitle}
                    </h1>
                </div>
                <p className='text-small text-default-400 lg:text-medium mt-1'>
                    {pageSubtitle}
                </p>
                <SiteBreadcrumbs separator='>' />
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
                {t('new_deployment_button')}
            </Button>
        </div>
    )
}
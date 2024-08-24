import { Icon } from '@iconify/react'
import {
    Button,
    ScrollShadow,
} from '@nextui-org/react'
import Breadcrumbs from '@/app/components/common/breadcrumbs';
import SiteBreadcrumbs from '@/app/components/common/breadcrumbs';

interface MyAccountProps {
    pageTitle: string;
    pageSubtitle: string;
    pageIcon: string;
}

export default function MyAccountHeader({ pageTitle, pageSubtitle, pageIcon }: MyAccountProps) {

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
                New Deployment
            </Button>
        </div>
    )
}
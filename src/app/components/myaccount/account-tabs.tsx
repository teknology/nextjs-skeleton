'use client'
import {
    Tabs,
    Tab,
    Card,
    CardBody,
    CardFooter,
    Image
} from '@nextui-org/react'
import MarketingCard from '@/app/components/myaccount/common/marketing-card'
import TeamMember from '@/app/components/myaccount/team-member'
import NotificationsCard from '@/app/components/myaccount/notification-card'


export default function AccountTabs() {


    return (
        <Tabs aria-label='Options' color='primary'>
            <Tab key='latest_news' title='Latest News'>
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
    )
}
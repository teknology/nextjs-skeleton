'use client'

import React, { act } from 'react'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
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
  Breadcrumbs,
  BreadcrumbItem,
  Input,
  Badge,
  user
} from '@nextui-org/react'
import { Icon } from '@iconify/react'
import * as actions from '@/actions'
import { AcmeIcon } from '@/app/components/icons'
import NotificationsCard from '@/app/components/myaccount/notification-card'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
export default function MyAccountNavbar() {
  const session = useSession()

  //console.log(session)
  const router = useRouter();

  const handleAction = (key: string) => {
    switch (key) {
      case 'settings':
        router.push('/my-account/settings');
        break;
      case 'account':
        router.push('/my-account');
        break;
      case 'help_and_feedback':
        console.log(key);
        break;
      case 'logout':
        // Add your logout logic here
        actions.signOut();
        break;
      default:
        console.log('Unknown action');
    }
  }
  return (
    <Navbar
      classNames={{
        base: 'bg-primary',
        wrapper: 'px-4 sm:px-6',
        item: 'data-[active=true]:text-primary'
      }}
      height='64px'
    >
      <NavbarBrand>
        <NavbarMenuToggle className='mr-2 h-6 sm:hidden' />
        <AcmeIcon />
        <p className='font-bold text-inherit'>ACME</p>
      </NavbarBrand>
      <Breadcrumbs className='hidden sm:flex' radius='full'>
        <BreadcrumbItem
          classNames={{
            separator: 'text-primary-foreground/50',
            item: 'text-primary-foreground/50'
          }}
        >
          Apps
        </BreadcrumbItem>
        <BreadcrumbItem
          classNames={{
            separator: 'text-primary-foreground/50',
            item: 'text-primary-foreground/50'
          }}
        >
          iOS App
        </BreadcrumbItem>
        <BreadcrumbItem
          classNames={{
            separator: 'text-primary-foreground/50',
            item: 'text-primary-foreground'
          }}
        >
          TestFlight
        </BreadcrumbItem>
      </Breadcrumbs>

      {/* Right Menu */}
      <NavbarContent
        className='ml-auto h-12 max-w-fit items-center gap-0'
        justify='end'
      >
        {/* Search */}
        <NavbarItem className='mr-2 hidden lg:flex'>
          <Input
            aria-label='Search'
            classNames={{
              base: 'px-1',
              inputWrapper:
                'bg-primary-400 dark:bg-primary-300 data-[hover=true]:bg-primary-300/80 group-data-[focus=true]:bg-primary-300',
              input:
                'font-light placeholder:text-primary-foreground/80 group-data-[has-value=true]:text-primary-foreground'
            }}
            labelPlacement='outside'
            placeholder='Search...'
            radius='full'
            startContent={
              <Icon
                className='text-primary-foreground/60 [&>g]:stroke-[2px]'
                icon='solar:magnifer-linear'
                width={20}
              />
            }
          />
        </NavbarItem>
        {/* Mobile search */}
        <NavbarItem className='lg:hidden'>
          <Button isIconOnly radius='full' variant='light'>
            <Icon
              className='text-primary-foreground/60'
              icon='solar:magnifer-linear'
              width={20}
            />
          </Button>
        </NavbarItem>
        {/* Theme change */}
        <NavbarItem className='hidden lg:flex'>
          <Button isIconOnly radius='full' variant='light'>
            <Icon
              className='text-primary-foreground/60'
              icon='solar:sun-linear'
              width={24}
            />
          </Button>
        </NavbarItem>
        {/* Settings */}
        <NavbarItem className='hidden lg:flex'>
          <Button isIconOnly radius='full' variant='light'>
            <Icon
              className='text-primary-foreground/60'
              icon='solar:settings-linear'
              width={24}
            />
          </Button>
        </NavbarItem>
        {/* Notifications */}
        <NavbarItem className='flex'>
          <Popover offset={12} placement='bottom-end'>
            <PopoverTrigger>
              <Button
                disableRipple
                isIconOnly
                className='overflow-visible'
                radius='full'
                variant='light'
              >
                <Badge color='danger' content='5' showOutline={false} size='md'>
                  <Icon
                    className='text-primary-foreground/60'
                    icon='solar:bell-linear'
                    width={22}
                  />
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className='max-w-[90vw] p-0 sm:max-w-[380px]'>
              <NotificationsCard className='w-full shadow-none' />
            </PopoverContent>
          </Popover>
        </NavbarItem>
        {/* User Menu */}
        <NavbarItem className='px-2'>
          <Dropdown placement='bottom-end'>
            <DropdownTrigger>
              <button className='mt-1 h-8 w-8 transition-transform'>
                <Badge
                  classNames={{
                    badge: 'border-primary'
                  }}
                  color='success'
                  content=''
                  placement='bottom-right'
                  shape='circle'
                >

                  <Avatar
                    size='sm'
                    src={session.data?.user?.image || ''}
                  />
                </Badge>
              </button>
            </DropdownTrigger>
            <DropdownMenu
              onAction={key => handleAction(key as string)}
              aria-label='Profile Actions'
              variant='flat'
            >
              <DropdownItem key='profile' className='h-14 gap-2'>
                <p className='font-semibold'>Signed in as</p>
                <p className='font-semibold'>{session.data?.user?.email}</p>
              </DropdownItem>
              <DropdownItem key='account'>
                My Account
              </DropdownItem>
              <DropdownItem key='settings'>
                Settings
              </DropdownItem>
              <DropdownItem key='billing'>Billing</DropdownItem>
              <DropdownItem key='help_and_feedback'>
                Help & Feedback
              </DropdownItem>
              <DropdownItem key='logout' color='danger'>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        <span> Signed in as {session.data?.user?.email} </span>
        <NavbarMenuItem>
          <Link className='w-full' color='foreground' href='#'>
            Account Home
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className='w-full' color='primary' href='#'>
            Websites
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className='w-full' color='primary' href='#'>
            Team
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className='w-full' color='foreground' href='#'>
            Settings
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className='w-full' color='foreground' href='#'>
            Help & Feedback
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className='w-full' color='foreground' href='#'>
            Logout
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  )
}

'use client'
import React, { useState, useEffect } from 'react'
import {
  Button,
  Tabs,
  Tab,
  ScrollShadow,
  Avatar, Spacer, Tooltip, useDisclosure,
  Skeleton
} from '@nextui-org/react'
import { Icon } from '@iconify/react'
import ProfileSetting from '@/app/components/myaccount/settings/profile/profile-setting'
import AppearanceSetting from '@/app/components/myaccount/settings/appearance-setting'
import AccountSetting from '@/app/components/myaccount/settings/account-setting'
import BillingSetting from '@/app/components/myaccount/settings/billing-setting'
import TeamSetting from '@/app/components/myaccount/settings/team-setting'
import MyAccountHeader from '@/app/components/myaccount/common/my-account-header'
import * as actions from '@/actions'

export default function Settings() {
  const { isOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = useState("profile");

  // State for loading and data
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const pageTitle = 'Settings';
  const pageSubtitle = 'Manage your profile, team and billing';
  const pageIcon = 'fluent:settings-32-light';

  useEffect(() => {
    // Load the initial profile data when the component mounts
    if (selected === "profile") {
      loadData();
    }
  }, []);

  useEffect(() => {
    if (selected !== "profile") {
      loadData();
    }
  }, [selected]);

  const loadData = async () => {
    setLoading(true);
    const profileData = await actions.getProfile();
    setData(profileData);
    setLoading(false);
  };

  const renderTabContent = () => {
    if (loading) {
      return <Skeleton className="h-[300px]" />;
    }

    switch (selected) {
      case 'profile':
        return <ProfileSetting data={data} />;
      case 'appearance':
        return <AppearanceSetting />;
      case 'account':
        return <AccountSetting />;
      case 'billing':
        return <BillingSetting />;
      case 'team':
        return <TeamSetting />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <>
      <MyAccountHeader pageTitle={pageTitle} pageSubtitle={pageSubtitle} pageIcon={pageIcon} />
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
            selectedKey={selected}
            onSelectionChange={(key) => setSelected(key.toString())}
          >
            <Tab key="profile" title="Profile">
              {renderTabContent()}
            </Tab>
            <Tab key="appearance" title="Appearance">
              {renderTabContent()}
            </Tab>
            <Tab key="account" title="Account">
              {renderTabContent()}
            </Tab>
            <Tab key="billing" title="Billing">
              {renderTabContent()}
            </Tab>
            <Tab key="team" title="Team">
              {renderTabContent()}
            </Tab>
          </Tabs>
        </div>
      </ScrollShadow>
    </>
  );
}

'use client'
import React, { useState, useEffect } from 'react';
import {
  Button,
  Tabs,
  Tab,
  ScrollShadow,
  Skeleton,
  useDisclosure
} from '@nextui-org/react';
import { Icon } from '@iconify/react';
import ProfileSetting from '@/app/components/myaccount/settings/profile/profile-setting';
import AppearanceSetting from '@/app/components/myaccount/settings/appearance-setting';
import AccountSetting from '@/app/components/myaccount/settings/account-setting';
import BillingSetting from '@/app/components/myaccount/settings/billing-setting';
import TeamSetting from '@/app/components/myaccount/settings/team-setting';
import MyAccountHeader from '@/app/components/myaccount/common/my-account-header';
import * as actions from '@/actions';

export default function Settings() {
  const { isOpen, onOpenChange } = useDisclosure();
  const [selected, setSelected] = useState("profile");

  // Individual state for each tab
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileData, setProfileData] = useState<any | null>(null);

  const [appearanceLoading, setAppearanceLoading] = useState(false);
  const [appearanceData, setAppearanceData] = useState<any | null>(null);

  const [accountLoading, setAccountLoading] = useState(false);
  const [accountData, setAccountData] = useState<any | null>(null);

  const [billingLoading, setBillingLoading] = useState(false);
  const [billingData, setBillingData] = useState<any | null>(null);

  const [teamLoading, setTeamLoading] = useState(false);
  const [teamData, setTeamData] = useState<any | null>(null);

  const pageTitle = 'Settings';
  const pageSubtitle = 'Manage your profile, team and billing';
  const pageIcon = 'fluent:settings-32-light';

  useEffect(() => {
    loadData(selected);
  }, [selected]);

  const loadData = async (tab: string) => {
    switch (tab) {
      case 'profile':
        setProfileLoading(true);
        const profileData = await actions.getProfileSettings();
        // console.log('profileData: (settings page) ', profileData);
        setProfileData(profileData);
        setProfileLoading(false);
        break;
      case 'appearance':
        setAppearanceLoading(true);
        const appearanceData = await actions.getAppearanceSettings();
        setAppearanceData(appearanceData);
        setAppearanceLoading(false);
        break;
      case 'account':
        setAccountLoading(true);
        const accountData = await actions.getAccountSettings();
        setAccountData(accountData);
        setAccountLoading(false);
        break;
      case 'billing':
        setBillingLoading(true);
        const billingData = await actions.getBillingSettings();
        setBillingData(billingData);
        setBillingLoading(false);
        break;
      case 'team':
        setTeamLoading(true);
        const teamData = await actions.getTeamSettings();
        setTeamData(teamData);
        setTeamLoading(false);
        break;
      default:
        break;
    }
  };

  const renderTabContent = () => {
    switch (selected) {
      case 'profile':
        return <ProfileSetting loading={profileLoading} data={profileData} />;
      case 'appearance':
        return <AppearanceSetting loading={appearanceLoading} data={appearanceData} />;
      case 'account':
        return <AccountSetting loading={accountLoading} data={accountData} />;
      case 'billing':
        return <BillingSetting loading={billingLoading} data={billingData} />;
      case 'team':
        return <TeamSetting loading={teamLoading} data={teamData} />;
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

'use client';

import * as React from "react";
import { Button, Input, Spacer, Textarea, SelectItem, Select, Skeleton, Image } from "@nextui-org/react";
import { cn } from "@/utils/cn";
import UserWidget from "./user-widget";
import { useSession } from "next-auth/react";
import { Country, Timezone } from "@/utils/types/types";
import { useEffect, useState } from "react";
import * as actions from '@/actions';
import { timezoneData } from "@/utils/data/timezones";
import FormButton from "@/app/components/common/form-button";
import { useFormState } from 'react-dom';
import { useTranslations } from "next-intl";

interface ProfileSettingCardProps {
  className?: string;
  data?: any;
  loading?: boolean;
}

const ProfileSetting = React.forwardRef<HTMLDivElement, ProfileSettingCardProps>(
  ({ data, className, loading = false, ...props }, ref) => {
    const t = useTranslations('my_account.settings.profile');
    const [countryCodes, setCountryCodes] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedTimezone, setSelectedTimezone] = useState<string | null>(null);
    const [formState, action] = useFormState(actions.updateProfileSettings, {
      status: 'idle',
      errors: {},
    });
    const [widgetData, setWidgetData] = useState({
      emailVerified: false,
      email: '',
      title: '',
      firstName: '',
      lastName: '',
      avatarSrc: '',
    });

    // Ensure the inputs are controlled
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [biography, setBiography] = useState('');

    // Set the form values when data is available
    useEffect(() => {
      if (data) {
        setFirstName(data.profile?.firstName || '');
        setLastName(data.profile?.lastName || '');
        setTitle(data.profile?.title || '');
        setEmail(data.profile?.email || '');
        setPhoneNumber(data.profile?.phoneNumber || '');
        setBiography(data.profile?.biography || '');
        setSelectedCountry(String(data.profile?.countryCodeId) || null);
        setSelectedTimezone(String(data.profile?.timezoneId) || null);
      }
    }, [data]);

    useEffect(() => {
      if (formState.status === 'success') {
        fetchNewData();
      }
    }, [formState]);

    useEffect(() => {
      fetchCountries();
    }, []);

    useEffect(() => {
      if (countryCodes.length > 0 && data?.profile?.countryCodeId) {
        setSelectedCountry(String(data.profile.countryCodeId));
      }
    }, [countryCodes, data?.profile?.countryCodeId]);

    useEffect(() => {
      if (data?.profile?.timezoneId) {
        setSelectedTimezone(String(data.profile.timezoneId));
      }
    }, [data?.profile?.timezoneId]);

    useEffect(() => {
      if (data) {
        setWidgetData({
          emailVerified: data?.profile?.emailVerified || false,
          email: data?.profile?.email || '',
          title: data?.profile?.title || '',
          firstName: data?.profile?.firstName || '',
          lastName: data?.profile?.lastName || '',
          avatarSrc: data?.image || '',
        });
      }
    }, [data]);

    async function fetchNewData() {
      try {
        const newData = await actions.getUpdatedUserData();
        setWidgetData({
          emailVerified: newData?.profile?.emailVerified || false,
          email: newData?.profile?.email || '',
          title: newData?.profile?.title || '',
          firstName: newData?.profile?.firstName || '',
          lastName: newData?.profile?.lastName || '',
          avatarSrc: newData?.image || '',
        });
      } catch (error) {
        console.error('Failed to fetch updated data:', error);
      }
    }

    async function fetchCountries() {
      try {
        const result = await actions.getCountries();
        if (Array.isArray(result)) {
          setCountryCodes(result);
        } else {
          console.error("Error fetching countries:", result.errors);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }

    return (
      <div ref={ref} className={cn("p-2", className)} {...props}>
        {/* Profile */}
        <div>
          <p className="mt-1 text-sm font-normal text-default-400">
            {t("description")}
          </p>
          {loading ? (
            <Skeleton className="h-20 w-full rounded-lg" />
          ) : (
            <UserWidget data={widgetData} />
          )}
        </div>
        <Spacer y={4} />
        <form action={action}>
          {/* First Name & Last Name */}
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <div className="w-full md:w-1/2">
              {loading ? (
                <Skeleton className="h-12 w-full rounded-lg" />
              ) : (
                <Input
                  label={t("first_name")}
                  className="mt-2"
                  name="firstName"
                  placeholder="e.g Kate"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  isInvalid={!!formState.errors?.firstName}
                  errorMessage={formState.errors.firstName?.join(', ')}
                />
              )}
            </div>
            <div className="w-full md:w-1/2">
              {loading ? (
                <Skeleton className="h-12 w-full rounded-lg" />
              ) : (
                <Input
                  label={t("last_name")}
                  className="mt-2"
                  name="lastName"
                  placeholder="e.g Moore"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  isInvalid={!!formState.errors?.lastName}
                  errorMessage={formState.errors.lastName?.join(', ')}
                />
              )}
            </div>
          </div>
          <Spacer y={2} />
          {/* Title & Email */}
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <div className="w-full md:w-1/2">
              {loading ? (
                <Skeleton className="h-12 w-full rounded-lg" />
              ) : (
                <Input
                  label={t("title")}
                  className="mt-2"
                  name="title"
                  placeholder="e.g C.E.O / Founder / President"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  isInvalid={!!formState.errors?.title}
                  errorMessage={formState.errors.title?.join(', ')}
                />
              )}
            </div>
            <div className="w-full md:w-1/2">
              {loading ? (
                <Skeleton className="h-12 w-full rounded-lg" />
              ) : (
                <Input
                  label={t("email")}
                  className="mt-2"
                  name="email"
                  placeholder="email@mydomain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!formState.errors?.email}
                  errorMessage={formState.errors.email?.join(', ')}
                />
              )}
            </div>
          </div>
          <Spacer y={2} />
          {/* Country Code, Phone Number & Timezone */}
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <div className="w-full md:w-1/2">
              {loading ? (
                <Skeleton className="h-12 w-full rounded-lg mt-2" />
              ) : (
                <Select
                  label={t("country_code")}
                  name="countryCodeId"
                  placeholder="Select a country code"
                  className="max-w-13 mt-2"
                  selectedKeys={selectedCountry ? [selectedCountry] : undefined}
                  selectionMode="single"
                  onSelectionChange={(keys) => setSelectedCountry(Array.from(keys)[0] as string)}
                  isInvalid={!!formState.errors?.countryCodeId}
                  errorMessage={formState.errors.countryCodeId?.join(', ')}
                >
                  {countryCodes.map((country) => (
                    <SelectItem
                      key={country.id}
                      value={String(country.id)}
                      startContent={
                        <Image
                          src={country.flag}
                          alt={`${country.country} flag`}
                          className="inline-block w-6 h-4 mr-2"
                        />
                      }
                      textValue={`${country.country} (${country.code})`}
                    >
                      <div className="flex items-center">
                        {`${country.country} (${country.code})`}
                      </div>
                    </SelectItem>
                  ))}
                </Select>
              )}
            </div>

            <div className="w-full md:w-1/2">
              {loading ? (
                <Skeleton className="h-12 w-full rounded-lg mt-2" />
              ) : (
                <Input
                  label={t("phone_number")}
                  className="mt-2"
                  name="phoneNumber"
                  placeholder="5555555555"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  isInvalid={!!formState.errors?.phoneNumber}
                  errorMessage={formState.errors.phoneNumber?.join(', ')}
                />
              )}
            </div>

            <div className="w-full md:w-1/2">
              {loading ? (
                <Skeleton className="h-12 w-full rounded-lg mt-2" />
              ) : (
                <Select
                  label={t("timezone")}
                  name="timezoneId"
                  placeholder="Select a timezone"
                  className="max-w-13 mt-2"
                  selectedKeys={selectedTimezone ? [selectedTimezone] : undefined}
                  selectionMode="single"
                  onSelectionChange={(keys) => setSelectedTimezone(Array.from(keys)[0] as string)}
                  isInvalid={!!formState.errors?.timezoneId}
                  errorMessage={formState.errors.timezoneId?.join(', ')}
                >
                  {timezoneData.map((timezone) => (
                    <SelectItem key={timezone.id} value={timezone.value} textValue={timezone.label}>
                      {timezone.label as string}
                    </SelectItem>
                  ))}
                </Select>
              )}
            </div>
          </div>
          <Spacer y={4} />
          {/* Biography */}
          <div>
            {loading ? (
              <Skeleton className="h-32 w-full rounded-lg mt-2" />
            ) : (
              <Textarea
                label={t("biography")}
                className="mt-2"
                name="biography"
                classNames={{
                  input: cn("min-h-[115px]"),
                }}
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                placeholder="e.g., 'Kate Moore - Acme.com Support Specialist. Passionate about solving tech issues, loves hiking and volunteering."
                isInvalid={!!formState.errors?.biography}
                errorMessage={formState.errors.biography?.join(', ')}
              />
            )}
          </div>
          {loading ? (
            <Skeleton className="h-12 w-full mt-4 rounded-lg" />
          ) : (
            <div className="my-2">
              <FormButton>{t('update_profile')}</FormButton>
            </div>
          )}
        </form>
      </div>
    );
  }
);

ProfileSetting.displayName = "ProfileSetting";

export default ProfileSetting;

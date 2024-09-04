import * as React from "react";
import {
  Button,
  Input,
  Spacer,
  Textarea,
  SelectItem,
  Select,
  Skeleton,
  Image
} from "@nextui-org/react";
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

// Define the interface for the user data


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
    console.log('passed data: profile setting file', data);
    console.log('widget data State: profile setting file', widgetData);
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
          emailVerified: data?.emailVerified || null,
          email: data?.email || null,
          title: data?.profile?.title || null,
          firstName: data?.profile?.firstName || null,
          lastName: data?.profile?.lastName || null,
          avatarSrc: data?.image || null,
        });
      }
    }
      , [data]);
    async function fetchNewData() {
      try {
        const newData = await actions.getUpdatedUserData();
        setWidgetData({
          emailVerified: newData?.emailVerified || false,
          email: newData?.email || '',
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
                  defaultValue={data?.profile?.firstName || ""}
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
                  defaultValue={data?.profile?.lastName || ""}
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
                  defaultValue={data?.profile?.title || ""}
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
                  defaultValue={data?.email || ""}
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
                  defaultValue={data?.profile?.phoneNumber || ""}
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
                defaultValue={data?.profile?.biography || ""}
                placeholder="e.g., 'Kate Moore - Acme.com Support Specialist. Passionate about solving tech issues, loves hiking and volunteering."
              />
            )}
          </div>
          {loading ? (
            <Skeleton className="h-12 w-full mt-4 rounded-lg" />
          ) : (
            <div className="my-2">
              {/* TODO: Have the user widget skeleton load while updating data */}

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
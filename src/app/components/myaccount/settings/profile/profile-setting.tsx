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
import { timezoneData } from "@/utils/data/timezones"; // Importing timezone data
import FormButton from "@/app/components/common/form-button"; // Importing SubmitButton component
import { useFormState } from 'react-dom'


interface ProfileSettingCardProps {
  className?: string;
  data?: any;
  loading?: boolean;
}

const ProfileSetting = React.forwardRef<HTMLDivElement, ProfileSettingCardProps>(
  ({ data, className, loading = false, ...props }, ref) => {
    const session = useSession();

    const [countryCodes, setCountryCodes] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedTimezone, setSelectedTimezone] = useState<string | null>(null); // Selected timezone
    const [formState, action] = useFormState(actions.updateProfileSettings, {
      errors: {}
    })

    useEffect(() => {
      async function fetchCountries() {
        try {
          let result = await actions.getCountries();
          if (Array.isArray(result)) {
            setCountryCodes(result);
          } else {
            console.error("Error fetching countries:", result.errors);
          }
        } catch (error) {
          console.error("Error fetching countries:", error);
        }
      }

      fetchCountries();
    }, []);

    useEffect(() => {
      if (countryCodes.length > 0 && data?.countryCodeId) {
        setSelectedCountry(String(data.countryCodeId));
      }
    }, [countryCodes, data?.countryCodeId]);

    useEffect(() => {
      if (data?.timezoneId) {
        console.log('provided timezoneId', data.timezoneId);
        setSelectedTimezone(String(4));
      }
    }, [data?.timezoneId]);

    return (
      <div ref={ref} className={cn("p-2", className)} {...props}>
        {/* Profile */}
        <div>
          <p className="text-base font-medium text-default-700">Profile</p>
          <p className="mt-1 text-sm font-normal text-default-400">
            This displays your public profile on the site.
          </p>
          {loading ? (
            <Skeleton className="h-20 w-full rounded-lg" />
          ) : (
            <UserWidget
              avatarSrc={session?.data?.user?.image || ""}
              firstName={data?.firstName || ""}
              lastName={data?.lastName || ""}
              email={session?.data?.user?.email || ""}
              emailVerified={session?.data?.user?.emailVerified || false}
              title={data?.title || ""}
            />
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
                  label="First Name"
                  className="mt-2"
                  name="firstName"
                  placeholder="e.g Kate"
                  defaultValue={data?.firstName || ""}
                />
              )}
            </div>
            <div className="w-full md:w-1/2">
              {loading ? (
                <Skeleton className="h-12 w-full rounded-lg" />
              ) : (
                <Input
                  label="Last Name"
                  className="mt-2"
                  name="lastName"
                  placeholder="e.g Moore"
                  defaultValue={data?.lastName || ""}
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
                  label="Title"
                  className="mt-2"
                  name="title"
                  placeholder="e.g C.E.O / Founder / President"
                  defaultValue={data?.title || ""}
                />
              )}
            </div>
            <div className="w-full md:w-1/2">
              {loading ? (
                <Skeleton className="h-12 w-full rounded-lg" />
              ) : (
                <Input
                  label="Email"
                  className="mt-2"
                  name="email"
                  placeholder="email@mydomain.com"
                  defaultValue={session?.data?.user?.email || ""}
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
                  label="Country Code"
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
                  label="Phone Number"
                  className="mt-2"
                  name="phoneNumber"
                  placeholder="5555555555"
                  defaultValue={data?.phoneNumber || ""}
                />
              )}
            </div>

            <div className="w-full md:w-1/2">
              {loading ? (
                <Skeleton className="h-12 w-full rounded-lg mt-2" />
              ) : (
                <Select
                  label="Timezone"
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
                label="Biography"
                className="mt-2"
                name="biography"
                classNames={{
                  input: cn("min-h-[115px]"),
                }}
                defaultValue={data?.biography || ""}
                placeholder="e.g., 'Kate Moore - Acme.com Support Specialist. Passionate about solving tech issues, loves hiking and volunteering."
              />
            )}
          </div>
          {loading ? (
            <Skeleton className="h-12 w-full mt-4 rounded-lg" />
          ) : (
            <div className="my-2">
              <FormButton>Update Profile</FormButton>

            </div>
          )}
        </form>
      </div>
    );
  }
);

ProfileSetting.displayName = "ProfileSetting";

export default ProfileSetting;

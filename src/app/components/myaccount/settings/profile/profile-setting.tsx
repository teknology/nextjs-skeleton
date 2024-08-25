'use client'
import * as React from "react";
import { Button, Badge, Input, Spacer, Textarea, SelectItem, Select, Skeleton } from "@nextui-org/react";
import { cn } from "@/utils/cn";
import { country_codes } from "@/utils/data/country-codes";
import UserWidget from "./user-widget";
import { useSession } from "next-auth/react";

interface ProfileSettingCardProps {
  className?: string;
  data?: any;
  loading?: boolean; // Add a loading prop
}

const ProfileSetting = React.forwardRef<HTMLDivElement, ProfileSettingCardProps>(
  ({ data, className, loading = false, ...props }, ref) => {
    const session = useSession();

    // Fallback values in case session data is not available
    const firstName = session?.data?.user?.name?.split(" ")[0] || "Kate";
    const lastName = data?.lastName?.split(" ")[1] || "Moore";
    const email = session?.data?.user?.email || "kate.moore@acme.com";
    const emailVerified = false;

    return (
      <div ref={ref} className={cn("p-2", className)} {...props}>
        {/* Profile */}
        <div>
          <p className="text-base font-medium text-default-700">Profile</p>
          <p className="mt-1 text-sm font-normal text-default-400">
            This displays your public profile on the site.
          </p>
          {loading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <UserWidget
              avatarSrc={data?.avatar || ""}
              firstName={data?.firstName || ""}
              lastName={data?.lastName || ""}
              email={data?.email || ""}
              emailVerified={data?.emailVerified || false}
              title={data?.title || ""}
            />
          )}
        </div>
        <Spacer y={4} />
        {/* First Name & Last Name */}
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <div className="w-full md:w-1/2">
            {loading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <Input label="First Name" className="mt-2" placeholder="e.g Kate" />
            )}
          </div>
          <div className="w-full md:w-1/2">
            {loading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <Input label="Last Name" className="mt-2" placeholder="e.g Moore" />
            )}
          </div>
        </div>
        {/* Title */}
        <div>
          {loading ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <Input label="Title" className="mt-2" placeholder="e.g C.E.O / Founder / President" />
          )}
        </div>
        <Spacer y={2} />
        {/* Email & Phone Number */}
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <div className="w-full md:w-1/2">
            {loading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <Input label="Email" className="mt-2" placeholder="email@mydomain.com " />
            )}
          </div>
          <div className="w-full md:w-1/3">
            {loading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <Select
                items={country_codes}
                label="Country Code"
                placeholder="Select a country code"
                className="max-w-13 mt-2"
              >
                {(country_code) => (
                  <SelectItem key={country_code.code}>
                    {`${country_code.country} (${country_code.code})`}
                  </SelectItem>
                )}
              </Select>
            )}
          </div>
          <div className="w-full md:w-1/2">
            {loading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <Input label="Phone Number" className="mt-2" placeholder="5555555555" />
            )}
          </div>
        </div>
        <Spacer y={4} />
        {/* Biography */}
        <div>
          {loading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <Textarea
              label="Biography"
              className="mt-2"
              classNames={{
                input: cn("min-h-[115px]"),
              }}
              placeholder="e.g., 'Kate Moore - Acme.com Support Specialist. Passionate about solving tech issues, loves hiking and volunteering."
            />
          )}
        </div>
        {loading ? (
          <Skeleton className="h-12 w-full mt-4" />
        ) : (
          <Button className="mt-4 bg-default-foreground text-background" size="md">
            Update Profile
          </Button>
        )}
      </div>
    );
  }
);

ProfileSetting.displayName = "ProfileSetting";

export default ProfileSetting;

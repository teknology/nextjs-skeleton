"use client";

import * as React from "react";
import { Card, CardBody } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { Icon } from "@iconify/react";
import { Button, Badge, Input, Spacer, Textarea, SelectItem, Select } from "@nextui-org/react";

import { cn } from "@/utils/cn";
import { country_codes } from "@/utils/data/country-codes";

interface ProfileSettingCardProps {
  className?: string;
}

const ProfileSetting = React.forwardRef<HTMLDivElement, ProfileSettingCardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-2", className)} {...props}>
      {/* Profile */}
      <div>
        <p className="text-base font-medium text-default-700">Profile</p>
        <p className="mt-1 text-sm font-normal text-default-400">
          This displays your public profile on the site.
        </p>
        <Card className="mt-4 bg-default-100" shadow="none">
          <CardBody>
            <div className="flex items-center gap-4">
              <Badge
                disableOutline
                classNames={{
                  badge: "w-5 h-5",
                }}
                content={
                  <Button
                    isIconOnly
                    className="h-5 w-5 min-w-5 bg-background p-0 text-default-500"
                    radius="full"
                    size="sm"
                    variant="bordered"
                  >
                    <Icon className="h-[9px] w-[9px]" icon="solar:pen-linear" />
                  </Button>
                }
                placement="bottom-right"
                shape="circle"
              >
                <Avatar
                  className="h-16 w-16"
                  src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/e1b8ec120710c09589a12c0004f85825.jpg"
                />
              </Badge>
              <div>
                <p className="text-sm font-medium text-default-600">Kate Moore</p>
                <p className="text-xs text-default-400">Customer Support</p>
                <p className="mt-1 text-xs text-default-400">kate.moore@acme.com</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <Spacer y={4} />
      {/* First Name & Last Name */}
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <div className="w-full md:w-1/2">
          <Input label="First Name" className="mt-2" placeholder="e.g Kate" />
        </div>
        <div className="w-full md:w-1/2">
          <Input label="Last Name" className="mt-2" placeholder="e.g Moore" />
        </div>
      </div>
      {/* Title */}
      <div>
        <Input label="Title" className="mt-2" placeholder="e.g C.E.O / Founder / President" />
      </div>
      <Spacer y={2} />
      {/* Email & Phone Number */}
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <div className="w-full md:w-1/2">
          <Input label="Email" className="mt-2" placeholder="email@mydomain.com " />
        </div>
        <div className="w-full md:w-1/3">
          <Select
            items={country_codes}
            label="Country Code"
            placeholder="Select a country code"
            className="max-w-13 mt-2"
          >
            {(country_code) => (
              <SelectItem key={country_code.code}>{`${country_code.country} (${country_code.code})`}</SelectItem>
            )}
          </Select>
        </div>
        <div className="w-full md:w-1/2">
          <Input label="Phone Number" className="mt-2" placeholder="5555555555" />
        </div>
      </div>
      <Spacer y={4} />
      {/* Biography */}
      <div>
        <Textarea
          label="Biography"
          className="mt-2"
          classNames={{
            input: cn("min-h-[115px]"),
          }}
          placeholder="e.g., 'Kate Moore - Acme.com Support Specialist. Passionate about solving tech issues, loves hiking and volunteering."
        />
      </div>
      <Button className="mt-4 bg-default-foreground text-background" size="md">
        Update Profile
      </Button>
    </div>
  ),
);

ProfileSetting.displayName = "ProfileSetting";

export default ProfileSetting;

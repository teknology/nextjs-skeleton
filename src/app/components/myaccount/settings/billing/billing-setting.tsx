"use client";

import * as React from "react";
import { Button, Input, RadioGroup, Select, SelectItem, Spacer } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { cn } from "@/utils/cn";
import { PlanCustomRadio } from "./plan-custom-radio";
import WebsiteTable from "./website-table";

interface BillingSettingCardProps {
  className?: string;
  loading?: boolean; // Add a loading prop
  data?: any;
}

const addressOptions = [
  {
    label: "Buenos Aires",
    value: "buenos-aires",
    description: "Buenos Aires",
  },
];

const countryOptions = [
  {
    label: "Argentina",
    value: "ar",
    description: "Argentina",
  },
];

const BillingSetting = React.forwardRef<HTMLDivElement, BillingSettingCardProps>(
  ({ data, className, loading = false, ...props }, ref) => (
    <div ref={ref} className={cn("p-2", className)} {...props}>
      {/* Payment Method */}
      <div>
        <div className="rounded-large bg-default-100">
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <div className="flex items-center gap-3">
              <Icon className="h-6 w-6 text-default-500" icon="solar:card-outline" />
              <div>
                <p className="text-sm font-medium text-default-600">Payment method</p>
                <p className="text-xs text-default-400">MasterCard credit card ending in ***3456</p>
              </div>
            </div>
            <Button
              className="bg-default-foreground text-background"
              radius="md"
              size="sm"
              variant="shadow"
            >
              Update
            </Button>
          </div>
        </div>
      </div>
      <Spacer y={4} />
      {/* Current Plan */}
      <div>
        <p className="text-base font-medium text-default-700">Current Plan</p>
        <p className="mt-1 text-sm font-normal text-default-400">
          Your free trial ends in <span className="text-default-500">8 days.</span>
        </p>
        {/* Plan radio group */}
        <RadioGroup
          className="mt-4"
          classNames={{
            wrapper: "gap-4 flex-row flex-wrap",
          }}
          defaultValue="pro-monthly"
          orientation="horizontal"
        >
          <PlanCustomRadio
            classNames={{
              label: "text-default-500 font-medium",
            }}
            description="Pro Monthly"
            value="pro-monthly"
          >
            <div className="mt-2">
              <p className="pt-2">
                <span className="text-[30px] font-semibold leading-7 text-default-foreground">
                  $12
                </span>
                &nbsp;<span className="text-xs font-medium text-default-400">/per month</span>
              </p>
              <ul className="list-inside list-disc text-xs font-normal text-default-500">
                <li>Unlimited users</li>
                <li>All features</li>
                <li>Support via email and chat</li>
                <li>Billed monthly, cancel any time</li>
              </ul>
            </div>
          </PlanCustomRadio>
          <PlanCustomRadio
            classNames={{
              label: "text-default-500 font-medium",
            }}
            description="Pro Yearly"
            value="pro-yearly"
          >
            <div className="mt-2">
              <p className="pt-2">
                <span className="text-[30px] font-semibold leading-7 text-default-foreground">
                  $72
                </span>
                &nbsp;<span className="text-xs font-medium text-default-400">/per year</span>
              </p>
              <ul className="list-inside list-disc text-xs font-normal text-default-500">
                <li>Unlimited users</li>
                <li>All features</li>
                <li>Support via email and chat</li>
                <li>Billed monthly, cancel any time</li>
              </ul>
            </div>
          </PlanCustomRadio>
        </RadioGroup>
      </div>
      <Spacer y={4} />

      <WebsiteTable />

      <Button className="mt-5 bg-default-foreground text-background" size="sm">
        Save
      </Button>
    </div>
  ),
);

BillingSetting.displayName = "BillingSetting";

export default BillingSetting;

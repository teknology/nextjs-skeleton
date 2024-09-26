"use client";

import * as React from "react";
import { Button, Divider, Input, RadioGroup, Select, SelectItem, Spacer } from "@nextui-org/react";
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
      <p className="text-base font-medium text-default-700">Current Payment Method</p>
      <p className="mt-1 text-sm font-normal text-default-400">
        Your free trial ends in <span className="text-default-500">8 days.</span>
      </p>
      <Spacer />
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
      <Divider />
      <Spacer y={4} />
      {/* Current Plan */}
      <div>
        <p className="text-base font-medium text-default-700">Current Plan</p>
        <p className="mt-1 text-sm font-normal text-default-400">
          Your free trial ends in <span className="text-default-500">8 days.</span>
        </p>
        {/* Plan radio group */}
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

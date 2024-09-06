"use client";

import * as React from "react";
import { Button, Input, Select, SelectItem, Spacer, Divider } from "@nextui-org/react";
import { cn } from "@/utils/cn";

interface AccountSettingCardProps {
    className?: string;
    loading?: boolean;
    data?: any;
}

const languageOptions = [
    { label: "English", value: "en" },
    { label: "Spanish", value: "es" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
];

const stateOptions = [
    { label: "California", value: "CA" },
    { label: "Texas", value: "TX" },
    { label: "New York", value: "NY" },
    { label: "Florida", value: "FL" },
];

const AccountSetting = React.forwardRef<HTMLDivElement, AccountSettingCardProps>(
    ({ data, loading = false, className, ...props }, ref) => {
        return (
            <div ref={ref} className={cn("p-2", className)} {...props}>
                {/* Address Section */}
                <div>
                    <p className="text-base font-medium text-default-700">Primary Address </p>
                    <p className="mt-1 text-sm font-normal text-default-400">Please add an address for comminucation related mail. </p>
                </div>
                <div style={{ display: "flex", gap: "16px" }}>
                    <Input className="mt-2" placeholder="Address 1" fullWidth />
                    <Input className="mt-2" placeholder="Address 2 (Optional)" fullWidth />
                </div>
                <Spacer y={2} />
                <div style={{ display: "flex", gap: "16px" }}>
                    <Input className="mt-2" placeholder="City" fullWidth />
                    <Select multiple className="mt-2" placeholder="Select State/Province" fullWidth>
                        {stateOptions.map((stateOption) => (
                            <SelectItem key={stateOption.value} value={stateOption.value}>
                                {stateOption.label}
                            </SelectItem>
                        ))}
                    </Select>
                    <Input className="mt-2" placeholder="Zipcode" fullWidth />
                </div>
                <Spacer y={2} />
                {/* Divider */}
                <Divider />
                <Spacer y={2} />
                {/* Language Selection */}
                <section>
                    <div>
                        <p className="text-base font-medium text-default-700">Language</p>
                        <p className="mt-1 text-sm font-normal text-default-400">Select your preferred language.</p>
                    </div>
                    <Select className="mt-2" defaultSelectedKeys={["en"]}>
                        {languageOptions.map((languageOption) => (
                            <SelectItem key={languageOption.value} value={languageOption.value}>
                                {languageOption.label}
                            </SelectItem>
                        ))}
                    </Select>
                </section>
                <Spacer y={2} />
                <Button className="mt-4 bg-default-foreground text-background" size="sm">
                    Update Account
                </Button>
            </div>
        );
    }
);

AccountSetting.displayName = "AccountSetting";

export default AccountSetting;

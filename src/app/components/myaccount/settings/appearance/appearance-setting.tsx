"use client";

import * as React from "react";
import { RadioGroup, Select, SelectItem, Spacer } from "@nextui-org/react";

import { cn } from "@/utils/cn";
import { ThemeCustomRadio } from "@/app/components/myaccount/settings/appearance/theme-custom-radio";
import SwitchCell from "@/app/components/myaccount/switch-cell";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface AppearanceSettingCardProps {
  className?: string;
  loading?: boolean; // Add a loading prop
  data: any;
}

const fontSizeOptions = [
  { label: "Small", value: "small", description: "font size 14px" },
  { label: "Medium", value: "medium", description: "font size 16px" },
  { label: "Large", value: "large", description: "font size 18px" },
];

const AppearanceSetting = React.forwardRef<HTMLDivElement, AppearanceSettingCardProps>(
  ({ data, loading = false, className, ...props }, ref) => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    if (!mounted) {
      return null
    }
    return (
      <div ref={ref} className={cn("p-2", className)} {...props}>
        {/* Theme */}
        <div>
          <p className="text-base font-medium text-default-700">Theme</p>
          <p className="mt-1 text-sm font-normal text-default-400">
            Change the appearance of the web.
          </p>
          {/* Theme radio group */}
          <RadioGroup onChange={e => setTheme(e.target.value)} className="mt-4 flex-wrap" orientation="horizontal">
            <ThemeCustomRadio value="light" variant="light">
              Light
            </ThemeCustomRadio>
            <ThemeCustomRadio value="dark" variant="dark">
              Dark
            </ThemeCustomRadio>
          </RadioGroup>
        </div>
      </div>
    );
  }
);

AppearanceSetting.displayName = "AppearanceSetting";

export default AppearanceSetting;

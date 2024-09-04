"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { RadioGroup } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";

import { cn } from "@/utils/cn";
import { ThemeCustomRadio } from "@/app/components/myaccount/settings/appearance/theme-custom-radio";
import SwitchCell from "@/app/components/myaccount/switch-cell";
import { useTranslations } from "next-intl";

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
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const t = useTranslations("my_account.settings.appearance");

    console.log("Appearance data", data);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return null; // Ensures component only renders after mounting
    }



    return (
      <div ref={ref} className={cn("p-2", className)} {...props}>
        {/* Theme */}
        <div>
          <p className="mt-1 text-sm font-normal text-default-400">
            {t("description")}
          </p>
          {/* Theme radio group */}
          <RadioGroup
            value={theme} // Set the default selected value based on the current theme
            onChange={e => setTheme(e.target.value)} // Handle theme change
            className="mt-4 flex-wrap"
            orientation="horizontal"
          >
            <ThemeCustomRadio value="light" variant="light">
              {t("light_mode")}
            </ThemeCustomRadio>
            <ThemeCustomRadio value="dark" variant="dark">
              {t("dark_mode")}
            </ThemeCustomRadio>
          </RadioGroup>
        </div>
      </div>
    );
  }
);

AppearanceSetting.displayName = "AppearanceSetting";

export default AppearanceSetting;

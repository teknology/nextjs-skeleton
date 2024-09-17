import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type CheckIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  height?: number;
  width?: number;
};

export type Profile = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  biography: string | null;
  title: string | null;
  phoneNumber: number | null;
  countryCode: string | null;
  userId: string
};

export type SignInPasswordFormState = {
  errors: {
    email?: string[];
    password?: string[];
    _form?: string[];
  }
}

export type Country = {
  id: number;
  code: string;
  country: string;
  alpha2: string;
  alpha3: string;
  flag: string;
};

export type StateProvince = {
  id: number;
  name: string;
  code: string;
};

export type Locale = {
  id: number;
  code: string;
  language: string;
};

export type Timezone = {
  id: string;
  label: string;
  value: string;
};
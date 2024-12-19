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
  code: string | null;
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

export interface AdapterUser {
  id: string;
  email: string;
  emailVerified: Date | null;
  username?: string;
  image?: string; // Remove `null` from the type here
  name?: string;
}

export interface AdapterAccount {
  userId: string;
  provider: string;
  providerAccountId: string;
  access_token?: string | null;
  refresh_token?: string | null;
  token_type?: string | null;
  id_token?: string | null;
  scope?: string | null;
  expires_at?: number | null;
}

export interface AdapterSession {
  sessionToken: string;
  userId: string;
  expires: Date;
}

// VerificationToken for email verification or other verification flows
export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

export interface PrismaUserWithProfile {
  id: string;
  username: string | null;
  image: string | null;
  profile: {
    id: string;
    email: string;
    emailVerifiedDate?: Date | null;
    isEmailVerified: boolean;
    firstName: string | null;
    lastName: string | null;
    title: string | null;
    biography: string | null;
    phoneNumber: number | null; // Update to match actual data
    localeId: number | null;
    timezoneId: number | null;
    userId: string;
  } | null;
}
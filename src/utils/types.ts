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
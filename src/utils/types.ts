import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type CheckIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  height?: number;
  width?: number;
};

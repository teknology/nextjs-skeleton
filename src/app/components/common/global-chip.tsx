import React from "react";
import { Chip } from "@nextui-org/react";

interface GlobalChipProps {
    children: React.ReactNode;
    icon: React.ReactNode;  // Required icon prop
    color?: any;
}

export default function GlobalChip({ children, icon, color, ...otherProps }: GlobalChipProps) {
    return (
        <Chip
            {...otherProps}
            className="mx-5 px-5"
            startContent={icon}  // Use the passed icon
            variant="faded"
            color={color}
        >
            {children}
        </Chip>
    );
}
import React from "react";
import { Chip } from "@nextui-org/react";

interface GlobalChipProps {
    children: React.ReactNode;
    icon: React.ReactNode;  // Required icon prop
    color?: any;
    className?: string;
}

export default function GlobalChip({ children, icon, color, className }: GlobalChipProps) {
    return (
        <Chip

            className={`mx-5 px-5 ${className}`}
            startContent={icon}  // Use the passed icon
            variant="faded"
            color={color}

        >
            {children}
        </Chip>
    );
}
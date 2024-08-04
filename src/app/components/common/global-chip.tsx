import React from "react";
import { Chip } from "@nextui-org/react";
import { NotificationIcon } from "@/app/components/icons";
import { CheckIcon } from "@/app/components/icons";

interface GlobalChipProps {
    children: React.ReactNode;
}
export default function GlobalChip({ children }: GlobalChipProps
) {
    return (
        <div className="flex gap-4 px-5">
            <Chip
                startContent={<CheckIcon size={18} />}
                variant="faded"
                color="success"
            >
                {children}
            </Chip>
            {/*
            <Chip
                endContent={<NotificationIcon size={18} />}
                variant="flat"
                color="secondary"
            >
                Chip
            </Chip>
            */}
        </div>
    );
}

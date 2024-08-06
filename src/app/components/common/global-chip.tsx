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

        <Chip
            className="mx-5 px-5"
            startContent={<CheckIcon size={18} />}
            variant="faded"
            color="success"
        >
            {children}
        </Chip>


    );
}

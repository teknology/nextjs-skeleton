import { Card, CardBody } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { Icon } from "@iconify/react";
import GlobalChip from "@/app/components/common/global-chip";
import { CheckIcon, ErrorIcon } from "@/app/components/icons";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, Button, Badge } from "@nextui-org/react";
import DragNDropUploader from "@/app/components/common/dragndrop-uploader";
import { use, useEffect, useState } from "react";

// Define the interface for the data prop
interface UserWidgetData {
    avatarSrc: string;
    firstName: string;
    lastName: string;
    email: string;
    title: string;
    emailVerified: boolean;
}

interface UserWidgetProps {
    data: UserWidgetData;
}

export default function UserWidget({ data }: UserWidgetProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [visible, setVisible] = useState(false);
    const [dataState, setDataState] = useState<UserWidgetData | null>(null);

    /*
     useEffect(() => {
         setDataState(data);
         console.log('data state changed')
         console.log('widget data State: user widget file', data);
     }, [data]);
 */

    //console.log('widget data State: user widget file', dataState);
    const onFilesAccepted = (files: File[]) => {
        // Handle file acceptance
    };

    const openModal = () => {
        setVisible(true);
    };

    const closeModal = () => {
        setVisible(false);
    };

    return (
        <Card className="mt-4 bg-default-100" shadow="none">
            <CardBody>
                <div className="flex items-center gap-4">
                    <Badge
                        classNames={{
                            badge: "w-5 h-5",
                        }}
                        content={
                            <Button
                                isIconOnly
                                className="h-5 w-5 min-w-5 bg-background p-0 text-default-500"
                                radius="full"
                                size="sm"
                                variant="bordered"
                                onPress={onOpen} // Open the modal
                            >
                                <Icon className="h-[9px] w-[9px]" icon="solar:pen-linear" />
                            </Button>
                        }
                        placement="bottom-right"
                        shape="circle"
                    >
                        <Avatar className="h-16 w-16" src={data?.avatarSrc} />
                    </Badge>
                    <Modal backdrop="blur"
                        size="5xl"
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Upload Your Profile Image</ModalHeader>
                                    <ModalBody>
                                        <DragNDropUploader onFilesAccepted={onFilesAccepted} onClose={onClose} />
                                    </ModalBody>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                    <div>
                        <p className="text-sm font-medium text-default-6 00">
                            {`${data?.firstName} ${data?.lastName}`}
                        </p>
                        <p className="text-xs text-default-400">{data?.title}</p>
                        <div className="mt-1 text-xs text-default-400 flex items-center">
                            {data?.email}
                            {data?.emailVerified ? (
                                <GlobalChip icon={<CheckIcon size={18} />} color="success" className="text-xs">
                                    Email Verified
                                </GlobalChip>
                            ) : (
                                <GlobalChip icon={<ErrorIcon size={18} />} color="danger" className="text-xs">
                                    Email Not Verified
                                </GlobalChip>
                            )}
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

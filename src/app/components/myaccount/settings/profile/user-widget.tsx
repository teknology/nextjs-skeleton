import { Card, CardBody } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { Icon } from "@iconify/react";
import GlobalChip from "@/app/components/common/global-chip";
import { CheckIcon, ErrorIcon } from "@/app/components/icons";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Badge, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";
import DragNDropUploader from "@/app/components/common/dragndrop-uploader";
import * as actions from "@/actions/"; // Import your server-side processing function
import { useState } from "react";

// Define the interface for props
interface UserWidgetProps {
    avatarSrc: string;
    firstName: string;
    lastName: string;
    email: string;
    title: string;
    emailVerified: boolean;
}

export default function UserWidget({
    avatarSrc,
    firstName,
    lastName,
    email,
    emailVerified,
    title,
}: UserWidgetProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [visible, setVisible] = useState(false);

    const onFilesAccepted = (files: File[]) => {
        //console.log('file accepted triggered');
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
                        <Avatar className="h-16 w-16" src={avatarSrc} />

                    </Badge>
                    <Modal backdrop="blur"
                        size='5xl'
                        isOpen={isOpen}
                        onClose={onClose}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Upload Your Profile Image</ModalHeader>
                                    <ModalBody>
                                        <DragNDropUploader onFilesAccepted={onFilesAccepted} onClose={onClose} />
                                    </ModalBody>

                                    {/*
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Close
                                        </Button>
                                        <Button color="primary" onPress={onClose}>
                                            Action
                                        </Button>
                                    </ModalFooter> */}
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                    <div>
                        <p className="text-sm font-medium text-default-600">
                            {`${firstName} ${lastName}`}
                        </p>
                        <p className="text-xs text-default-400">{title}</p>
                        <div className="mt-1 text-xs text-default-400 flex items-center">
                            {email}
                            {emailVerified ? (
                                <GlobalChip icon={<CheckIcon size={18} />} color="success" className="text-xs">
                                    Email  Verified
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

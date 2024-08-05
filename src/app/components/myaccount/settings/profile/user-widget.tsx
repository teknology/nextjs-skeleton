import { Card, CardBody } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { Icon } from "@iconify/react";
import GlobalChip from "@/app/components/common/global-chip";
import { CheckIcon } from "@/app/components/icons";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Badge, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";
import DragNDropUploader from "@/app/components/common/dragndrop-uploader";

// Define the interface for props
interface UserWidgetProps {
    avatarSrc: string;
    firstName: string;
    lastName: string;
    email: string;
    isVerified: boolean;
}

export default function UserWidget({
    avatarSrc,
    firstName,
    lastName,
    email,
    isVerified,
}: UserWidgetProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();


    return (
        <Card className="mt-4 bg-default-100" shadow="none">
            <CardBody>
                <div className="flex items-center gap-4">
                    <Badge
                        disableOutline
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
                        isOpen={isOpen}
                        onClose={onClose}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                                    <ModalBody>
                                        <DragNDropUploader />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Close
                                        </Button>
                                        <Button color="primary" onPress={onClose}>
                                            Action
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                    <div>
                        <p className="text-sm font-medium text-default-600">
                            {`${firstName} ${lastName}`}
                        </p>
                        <p className="text-xs text-default-400">Customer Support</p>
                        <p className="mt-1 text-xs text-default-400 flex items-center">
                            {email}
                            {isVerified && (
                                <GlobalChip>
                                    {/*  <CheckIcon className="w-4 h-4 text-blue-500 mr-1" /> */}
                                    Verified
                                </GlobalChip>
                            )}
                        </p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

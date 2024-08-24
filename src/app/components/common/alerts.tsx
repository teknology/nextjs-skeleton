'use client'
import React, { useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Avatar, Card, CardBody, Button } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { CameraIcon } from '../icons';

export default function AlertComponent() {
    const [isVisible, setIsVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClose = () => {
        setIsAnimating(true);
    };

    return (
        isVisible && (
            <motion.div
                initial={{ opacity: 1 }}
                animate={isAnimating ? { opacity: 0 } : { opacity: 1 }}
                onAnimationComplete={() => {
                    if (isAnimating) setIsVisible(false);
                }}
                transition={{ duration: 0.5 }}
            >
                <Card className='my-5 mb-14'>
                    <CardBody className='flex-row items-center'> {/* Aligns items vertically center */}
                        <Avatar
                            isBordered
                            color="warning"
                            showFallback
                            src='https://images.unsplash.com/broken'
                            fallback={
                                <CameraIcon className="animate-pulse w-6 h-6 text-white" color='warning' size={20} />
                            }
                            className="mr-4"
                        />
                        <div className="alert-content flex-1">
                            <h5 className="font-bold">Payment Alert</h5>
                            <p>Make beautiful websites regardless of your design experience.</p>
                        </div>
                        <Button
                            isIconOnly
                            onClick={handleClose}
                            aria-label="Close alert"
                            className="p-0 m-0 min-w-[24px] h-[24px] focus:outline-none close-button"
                        >
                            <Icon icon="mdi:close" width={15} height={20} />
                        </Button>
                    </CardBody>
                </Card>
            </motion.div>
        )
    );
}

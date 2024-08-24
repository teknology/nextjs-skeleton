'use client';

import React from 'react';
import { Breadcrumbs, BreadcrumbItem, Chip, CardBody, Card } from '@nextui-org/react';
import { usePathname } from 'next/navigation';

interface BreadcrumbsProps {
    separator?: string;
}

export default function SiteBreadcrumbs({ separator = '/' }: BreadcrumbsProps) {
    const pathname = usePathname();
    const pathnames = pathname.split('/').filter((x) => x);

    return (
        <div className='my-3'>
            <Breadcrumbs className='hidden sm:flex' radius='full' aria-label="breadcrumb" separator={separator}>
                <BreadcrumbItem classNames={{
                    separator: 'text-primary',
                    item: 'text-primary'
                }} href="/">Home</BreadcrumbItem>
                {pathnames.map((value, index) => {
                    const href = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    {/* TODO: Find out why the breadcrumbs is not showing the page Title */ }
                    {/* TODO: Update the active link */ }
                    return (

                        <BreadcrumbItem classNames={isLast ? {
                            separator: 'text-primary',
                            item: 'text-primary'
                        } : {
                            separator: 'text-primary',
                            item: 'text-primary'
                        }} key={href} href={isLast ? undefined : href}>
                            {decodeURIComponent(value)}
                        </BreadcrumbItem>
                    );
                })}
            </Breadcrumbs>

        </div>
    );
}

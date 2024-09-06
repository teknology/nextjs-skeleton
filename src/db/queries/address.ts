'use server'
import { db } from '@/db';
import { auth } from '@/auth';
import type { Address } from '@prisma/client';

export type { Address };


export async function getPrimaryAddress(uId: string = ""): Promise<Address[] | null> {
    const session = await auth();
    try {
        const primaryAddress = await db.address.findMany({
            where: {
                userId: session?.user?.id,
                type: 'HOME',
            }
        });
        return primaryAddress; // Add type assertion
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export async function updatePrimaryAddress(data: Address): Promise<Address | string | null> {
    if (Object.keys(data).length !== 0) {
        try {
            const session = await auth();
            const existingAddress = await db.address.findFirst({
                where: {
                    userId: session?.user?.id,
                    type: 'HOME',
                },
            });

            if (!existingAddress) {
                return 'Address not found';
            }

            const primaryAddress = await db.address.update({
                where: {
                    id: existingAddress.id, // Use the unique `id` of the found address
                },
                data: {
                    ...data,
                },
            });
            return primaryAddress;
        } catch (error) {
            console.error('Failed to update address:', (error as Error).message);
            return (error as Error).message;
        }
    }
    return null;
}


export async function createPrimaryAddress(data: Address): Promise<Address | string | null> {
    if (Object.keys(data).length !== 0) {
        try {
            const session = await auth();
            const primaryAddress = await db.address.create({
                data: {
                    ...data,
                    userId: session?.user?.id!,
                    type: 'HOME',
                },
            });
            return primaryAddress;
        } catch (error) {
            console.error('Failed to create address:', (error as Error).message);
            return (error as Error).message;
        }
    }
    return null;
}

export async function deletePrimaryAddress(): Promise<Address | string | null> {
    try {
        const session = await auth();
        const existingAddress = await db.address.findFirst({
            where: {
                userId: session?.user?.id,
                type: 'HOME',
            },
        });

        if (!existingAddress) {
            return 'Address not found';
        }

        const primaryAddress = await db.address.delete({
            where: {
                id: existingAddress.id,
            },
        });
        return primaryAddress;
    } catch (error) {
        console.error('Failed to delete address:', (error as Error).message);
        return (error as Error).message;
    }
}

export async function getBusinessAddress(uId: string = ""): Promise<Address[] | null> {
    const session = await auth();
    try {
        const businessAddress = await db.address.findMany({
            where: {
                userId: session?.user?.id,
                type: 'BUSINESS',
            }
        });
        return businessAddress; // Add type assertion
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export async function updateBusinessAddress(data: Address): Promise<Address | string | null> {
    if (Object.keys(data).length !== 0) {
        try {
            const session = await auth();
            const existingAddress = await db.address.findFirst({
                where: {
                    userId: session?.user?.id,
                    type: 'BUSINESS',
                },
            });

            if (!existingAddress) {
                return 'Address not found';
            }

            const businessAddress = await db.address.update({
                where: {
                    id: existingAddress.id, // Use the unique `id` of the found address
                },
                data: {
                    ...data,
                },
            });
            return businessAddress;
        } catch (error) {
            console.error('Failed to update address:', (error as Error).message);
            return (error as Error).message;
        }
    }
    return null;
}


export async function createBusinessAddress(data: Address): Promise<Address | string | null> {
    if (Object.keys(data).length !== 0) {
        try {
            const session = await auth();
            const businessAddress = await db.address.create({
                data: {
                    ...data,
                    userId: session?.user?.id!,
                    type: 'BUSINESS',
                },
            });
            return businessAddress;
        } catch (error) {
            console.error('Failed to create address:', (error as Error).message);
            return (error as Error).message;
        }
    }
    return null;
}
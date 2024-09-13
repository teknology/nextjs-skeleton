import { auth } from '@/auth'; // Ensure you import auth to retrieve the session
import { db } from '@/db';
import { Address } from '@prisma/client';

/**
 * Create a new address for a user by user ID.
 * If userId is empty, retrieve it from the session.
 * @param userId The ID of the user to create the address for.
 * @param data Address data to create.
 * @param type Address type ('RESIDENTIAL', 'COMMERCIAL')
 * @returns The newly created address.
 */
export async function createAddressByUserId(
    userId: string,
    data: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>,
    type: 'RESIDENTIAL' | 'COMMERCIAL'
): Promise<Address | null> {
    // Retrieve userId from session if it's empty
    if (!userId) {
        const session = await auth();
        userId = session?.user?.id as string;
    }

    if (!userId) {
        throw new Error('User not authenticated.');
    }

    try {
        const profile = await db.profile.findUnique({
            where: { userId: userId },
        });

        if (!profile) {
            throw new Error(`Profile not found for user with ID: ${userId}`);
        }

        const address = await db.address.create({
            data: {
                ...data,
                addressType: type, // Set the address type directly
            },
        });

        await db.profileAddress.create({
            data: {
                profileId: profile.id,
                addressId: address.id,
                isMailing: type === 'RESIDENTIAL', // Set mailing for residential address
            },
        });

        return address;
    } catch (error) {
        console.error('Failed to create address for user:', error);
        throw new Error('Failed to create address.');
    }
}

/**
 * Update an existing address for a user by user ID.
 * If userId is empty, retrieve it from the session.
 * @param userId The ID of the user whose address should be updated.
 * @param type Address type ('RESIDENTIAL' | 'COMMERCIAL')
 * @param data The address data to update.
 * @returns The updated address or null if the update fails.
 */
export async function updateAddressByUserId(
    userId: string,
    type: 'RESIDENTIAL' | 'COMMERCIAL',
    data: Partial<Address>
): Promise<Address | null> {
    // Retrieve userId from session if it's empty
    if (!userId) {
        const session = await auth();
        userId = session?.user?.id as string;
    }

    if (!userId) {
        throw new Error('User not authenticated.');
    }

    try {
        const profile = await db.profile.findUnique({
            where: { userId: userId },
        });

        if (!profile) {
            throw new Error(`Profile not found for user with ID: ${userId}`);
        }

        const address = await db.address.findFirst({
            where: {
                profiles: {
                    some: { profileId: profile.id },
                },
                addressType: type, // Use the enum directly
            },
        });

        if (!address) {
            throw new Error(`Address of type '${type}' not found for user with ID: ${userId}`);
        }

        const updatedAddress = await db.address.update({
            where: { id: address.id },
            data,
        });

        return updatedAddress;
    } catch (error) {
        console.error(`Failed to update ${type} address for user:`, error);
        throw new Error('Failed to update address.');
    }
}

/**
 * Delete an existing address for a user by user ID.
 * If userId is empty, retrieve it from the session.
 * @param userId The ID of the user whose address should be deleted.
 * @param type Address type ('RESIDENTIAL', 'COMMERCIAL')
 * @returns A success message or an error if deletion fails.
 */
export async function deleteAddressByUserId(userId: string, type: 'RESIDENTIAL' | 'COMMERCIAL'): Promise<string | null> {
    // Retrieve userId from session if it's empty
    if (!userId) {
        const session = await auth();
        userId = session?.user?.id as string;
    }

    if (!userId) {
        throw new Error('User not authenticated.');
    }

    try {
        const profile = await db.profile.findUnique({
            where: { userId: userId },
        });

        if (!profile) {
            throw new Error(`Profile not found for user with ID: ${userId}`);
        }

        const address = await db.address.findFirst({
            where: {
                profiles: {
                    some: { profileId: profile.id },
                },
                addressType: type, // Use the enum directly
            },
        });

        if (!address) {
            throw new Error(`Address of type '${type}' not found for user with ID: ${userId}`);
        }

        await db.profileAddress.deleteMany({
            where: {
                profileId: profile.id,
                addressId: address.id,
            },
        });

        await db.address.delete({
            where: { id: address.id },
        });

        return `Address of type '${type}' deleted successfully.`;
    } catch (error) {
        console.error(`Failed to delete ${type} address for user:`, error);
        throw new Error('Failed to delete address.');
    }
}

/**
 * Fetch a user's billing address by user ID.
 * If userId is empty, retrieve it from the session.
 * @param userId The ID of the user whose billing address should be fetched.
 * @returns The billing address or null if not found.
 */
export async function getBillingAddressByUserId(userId: string): Promise<Address | null> {
    // Retrieve userId from session if it's empty
    if (!userId) {
        const session = await auth();
        userId = session?.user?.id as string;
    }

    if (!userId) {
        throw new Error('User not authenticated.');
    }

    try {
        const profile = await db.profile.findUnique({
            where: { userId: userId },
        });

        if (!profile) {
            throw new Error(`Profile not found for user with ID: ${userId}`);
        }

        const profileAddress = await db.profileAddress.findFirst({
            where: {
                profileId: profile.id,
                isBilling: true, // Flag indicating it's a billing address
            },
            include: { address: true },
        });

        return profileAddress?.address || null;
    } catch (error) {
        console.error('Failed to fetch billing address by user ID:', error);
        throw new Error('Failed to fetch billing address.');
    }
}

/**
 * Fetch a user's mailing address by user ID.
 * If userId is empty, retrieve it from the session.
 * @param userId The ID of the user whose mailing address should be fetched.
 * @returns The mailing address or null if not found.
 */
export async function getMailingAddressByUserId(userId: string = ''): Promise<Address | null> {
    // Retrieve userId from session if it's empty
    if (!userId) {
        const session = await auth();
        userId = session?.user?.id as string;
    }

    if (!userId) {
        throw new Error('User not authenticated.');
    }

    try {
        const profile = await db.profile.findUnique({
            where: { userId: userId },
        });

        if (!profile) {
            throw new Error(`Profile not found for user with ID: ${userId}`);
        }

        const profileAddress = await db.profileAddress.findFirst({
            where: {
                profileId: profile.id,
                isMailing: true, // Flag indicating it's a mailing address
            },
            include: { address: true },
        });

        return profileAddress?.address || null;
    } catch (error) {
        console.error('Failed to fetch mailing address by user ID:', error);
        throw new Error('Failed to fetch mailing address.');
    }
}

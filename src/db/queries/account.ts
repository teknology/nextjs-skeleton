'use server'
import { db } from '@/db'; // Import the Prisma database client
import { auth } from '@/auth'; // Import the authentication function
import type { Account, Address } from '@prisma/client'; // Import the Account type from Prisma schema

// Export the imported types for usage in other parts of the application
export type { Account };

/**
 * Fetch an account by user ID, and separate mailing and billing addresses.
 * @param userId - The ID of the user (optional, default is an empty string).
 * @returns The account with separate mailing and billing addresses, or null if not found.
 */
export async function getAccountWithAddressesByUserId(userId: string = ""): Promise<{ account: Account | null, billingAddress: Address | null, mailingAddress: Address | null }> {
    const session = await auth(); // Get the authenticated session

    try {
        // Fetch the account based on the session's user ID
        const account = await db.account.findFirst({
            where: {
                userId: userId || session?.user?.id,
            },
            include: {
                addresses: {
                    include: {
                        address: true, // Include address details
                    },
                },
            },
        });

        if (!account) {
            return { account: null, billingAddress: null, mailingAddress: null };
        }

        // Separate mailing and billing addresses
        const billingAddress = account.addresses.find(addr => addr.isBilling)?.address || null;
        const mailingAddress = account.addresses.find(addr => addr.isMailing)?.address || null;

        return {
            account,
            billingAddress,
            mailingAddress,
        };
    } catch (error) {
        console.error('Failed to fetch account with addresses:', error); // Log any errors encountered
        throw new Error('Failed to fetch account with addresses.'); // Throw a user-friendly error
    }
}

/**
 * Update an account for the current authenticated user, including mailing and billing addresses.
 * @param data - The account data to update.
 * @param mailingAddress - The mailing address data to update.
 * @param billingAddress - The billing address data to update.
 * @returns The updated account, an error message, or null if no data was provided.
 */
export async function updateAccountWithAddress(
    data: Account,
    mailingAddress: Address | null,
    billingAddress: Address | null
): Promise<Account | string | null> {
    if (Object.keys(data).length !== 0 || mailingAddress || billingAddress) { // Check if the provided data is not empty
        try {
            const session = await auth(); // Get the authenticated session

            // Update the account for the user based on their user ID
            const updatedAccount = await db.account.update({
                where: {
                    userId: session?.user?.id,
                },
                data: {
                    ...data, // Update the account with the provided data
                },
            });

            // If mailing address is provided, update it
            if (mailingAddress) {
                await db.address.update({
                    where: {
                        id: mailingAddress.id,
                    },
                    data: {
                        ...mailingAddress,
                    },
                });
            }

            // If billing address is provided, update it
            if (billingAddress) {
                await db.address.update({
                    where: {
                        id: billingAddress.id,
                    },
                    data: {
                        ...billingAddress,
                    },
                });
            }

            return updatedAccount; // Return the updated account
        } catch (error) {
            console.error('Failed to update account and addresses:', (error as Error).message); // Log the error message
            return (error as Error).message; // Return the error message
        }
    }
    return null; // Return null if no data was provided
}


/**
 * Fetch an account by user ID, including mailing and billing addresses.
 * If no user ID is provided, it will use the ID from the current authenticated session.
 * @param userId - The ID of the user (optional, default is an empty string).
 * @returns The account associated with the user, including mailing and billing addresses, or null if not found.
 */
export async function getAccountByUserId() {
    const session = await auth(); // Get the authenticated session

    try {
        // Fetch the account based on the session's user ID, including mailing and billing addresses
        const account = await db.account.findFirst({
            where: {
                userId: session?.user?.id,
            },
            include: {
                addresses: {
                    include: {
                        address: true, // Include address details
                    },
                },
            },
        });

        console.log('account:dbquery', account)

        return account as Account | null; // Return the account if found, otherwise return null
    } catch (error) {
        console.error('Failed to fetch account with addresses:', error); // Log any errors encountered
        throw new Error('Failed to fetch account with addresses.'); // Throw a user-friendly error
    }
}

/**
 * Update an account for the current authenticated user.
 * @param data - The account data to update.
 * @returns The updated account, an error message, or null if no data was provided.
 */
export async function updateAccount(data: Account): Promise<Account | string | null> {
    if (Object.keys(data).length !== 0) { // Check if the provided data is not empty
        try {
            const session = await auth(); // Get the authenticated session
            // Update the account for the user based on their user ID
            const account = await db.account.update({
                where: {
                    userId: session?.user?.id,
                },
                data: {
                    ...data, // Update the account with the provided data
                },
            });
            return account; // Return the updated account
        } catch (error) {
            console.error('Failed to update account:', (error as Error).message); // Log the error message
            return (error as Error).message; // Return the error message
        }
    }
    return null; // Return null if no data was provided
}



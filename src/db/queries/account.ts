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
 * @param accountUpdateData - The account data to update (locale, etc.).
 * @param mailingAddress - The mailing address data to update.
 * @param billingAddress - The billing address data to update.
 * @returns An object with a status and message indicating success or failure.
 */
export async function updateAccountWithAddress(accountUpdateData: any, mailingAddress: Partial<Address>, billingAddress: Partial<Address>) {
    const session = await auth(); // Get the authenticated session

    // Ensure the user is logged in
    if (!session || !session.user || !session.user.id) {
        return {
            status: 'error',
            message: 'User not logged in.',
        };
    }

    try {
        // Validate localeId before proceeding
        if (accountUpdateData.localeId) {
            const localeExists = await db.locale.findUnique({
                where: { id: accountUpdateData.localeId },
            });

            if (!localeExists) {
                throw new Error('Invalid locale ID');
            }
        }

        // Fetch existing account data from the database, including addresses
        const existingAccount = await db.account.findUnique({
            where: { userId: session.user.id },
            include: {
                addresses: {
                    include: {
                        address: true, // Include the actual address details
                    },
                },
            },
        });

        if (!existingAccount) {
            throw new Error('Account not found');
        }

        const updates: any = {};

        // Check for changes in locale
        if (existingAccount.localeId !== accountUpdateData.localeId) {
            updates['localeId'] = accountUpdateData.localeId;
        }

        // Mailing Address: Compare and collect updates
        const existingMailingAddress = existingAccount.addresses.find((addr) => addr.isMailing);
        const mailingAddressUpdates: any = {};

        if (existingMailingAddress) {
            for (const key in mailingAddress) {
                if (mailingAddress[key as keyof Address] !== existingMailingAddress.address[key as keyof Address]) {
                    mailingAddressUpdates[key as keyof Address] = mailingAddress[key as keyof Address];
                }
            }
        } else {
            // If no mailing address exists, treat it as a new address
            Object.assign(mailingAddressUpdates, mailingAddress);
        }

        // Billing Address: Compare and collect updates
        const existingBillingAddress = existingAccount.addresses.find((addr) => addr.isBilling);
        const billingAddressUpdates: any = {};

        if (existingBillingAddress) {
            for (const key in billingAddress) {
                if (billingAddress[key as keyof Address] !== existingBillingAddress.address[key as keyof Address]) {
                    billingAddressUpdates[key as keyof Address] = billingAddress[key as keyof Address];
                }
            }
        } else {
            // If no billing address exists, treat it as a new address
            Object.assign(billingAddressUpdates, billingAddress);
        }

        console.log("dbquery: updates", updates);
        console.log("dbquery: mailingAddressUpdates", mailingAddressUpdates);
        console.log("dbquery: billingAddressUpdates", billingAddressUpdates);


        // Only perform the update if there are changes
        if (Object.keys(updates).length > 0 || Object.keys(mailingAddressUpdates).length > 0 || Object.keys(billingAddressUpdates).length > 0) {
            await db.account.update({
                where: { userId: session.user.id },
                data: {
                    ...updates, // Updates for the account itself
                    addresses: {
                        upsert: [
                            {
                                where: {
                                    accountId_addressId: {
                                        accountId: existingAccount.id,
                                        addressId: existingMailingAddress?.addressId || '', // Use the proper address relation
                                    },
                                },
                                update: {
                                    address: {
                                        update: {
                                            ...mailingAddressUpdates, // The updates for the address
                                        },
                                    },
                                },
                                create: {
                                    address: {
                                        create: {
                                            ...mailingAddress, // The data to create a new address
                                            addressType: mailingAddress.addressType, // Use dynamic addressType from mailingAddress
                                        },
                                    },
                                    isMailing: true, // AccountAddress field
                                },
                            },
                            {
                                where: {
                                    accountId_addressId: {
                                        accountId: existingAccount.id,
                                        addressId: existingBillingAddress?.addressId || '', // Use the proper address relation
                                    },
                                },
                                update: {
                                    address: {
                                        update: {
                                            ...billingAddressUpdates, // The updates for the address
                                        },
                                    },
                                },
                                create: {
                                    address: {
                                        create: {
                                            ...billingAddress, // The data to create a new address
                                            addressType: billingAddress.addressType, // Use dynamic addressType from billingAddress
                                        },
                                    },
                                    isBilling: true, // AccountAddress field
                                },
                            },
                        ],
                    },
                },
            });
        }

        return {
            status: 'success',
            message: 'Account settings updated successfully',
        };
    } catch (error) {
        console.error('Failed to update account settings:', error);
        return {
            status: 'error',
            message: 'Failed to save to the database.',
        };
    }
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

        console.log('account:dbquery', account);

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

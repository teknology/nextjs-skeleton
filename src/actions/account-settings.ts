'use server'
import { getLocaleByUser } from "./locale";
import { getMailingAddress } from "./address";

export async function getAccountSettings() {
    try {
        // Execute both promises concurrently, but handle failures for each individually
        const [mailingAddressResult, localeResult] = await Promise.allSettled([
            getMailingAddress(),
            getLocaleByUser(),
        ]);

        // Check the result of each promise
        if (mailingAddressResult.status === 'rejected') {
            throw new Error(`Failed to fetch mailing address: ${mailingAddressResult.reason}`);
        }

        if (localeResult.status === 'rejected') {
            throw new Error(`Failed to fetch locale: ${localeResult.reason}`);
        }

        // Both promises resolved successfully, so extract their values
        const data = mailingAddressResult.value;
        const userLocale = localeResult.value;

        if (!data) {
            throw new Error('Mailing address not found.');
        }
        if (!userLocale) {
            throw new Error('Locale not found.');
        }

        // Return a single, flattened object
        return {
            ...data,  // Spread the mailingAddress properties
            locale: userLocale    // Add the locale property
        };
    } catch (err: unknown) {
        console.error('Failed to fetch account settings:', (err as Error).message);
        throw new Error('Unable to fetch account settings.');
    }
}

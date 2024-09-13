'use server';

import { auth } from '@/auth'; // Import the authentication function
import { getAppearanceSettings as getData } from '@/db/queries/appearance'; // Import function to get appearance settings from the database
import type { Appearance } from '@prisma/client'; // Import the Appearance type from Prisma

/**
 * Fetch the appearance settings for the authenticated user.
 * If the user ID is available, it fetches the appearance data from the database.
 * If the user ID is not found, it throws an error.
 * @returns The appearance data for the user, or throws an error if not found.
 */
export async function getAppearanceSettings() {
    const session = await auth(); // Get the authenticated session
    const userId = session?.user?.id; // Extract the user ID from the session

    try {
        // If a valid user ID is present
        if (userId) {
            // Fetch the appearance settings from the database using the user ID
            const appearanceData = await getData(userId);

            // TODO: Consider trimming down the data to only the necessary fields
            console.log('appearanceData:ActionFile', appearanceData); // Log the appearance data for debugging

            if (appearanceData) {
                return appearanceData; // Return the appearance data if found
            }

            // Throw an error if appearance data is not found (useful in production)
            throw new Error('Profile not found. You may need to log out and log back in');
        } else {
            throw new Error('User ID is undefined.'); // Error if the user ID is missing
        }
    } catch (error) {
        console.error('Failed to fetch user:', error); // Log any errors encountered
        throw new Error('Failed to fetch user.'); // Throw a user-friendly error message
    }
}

/**
 * Fetch the theme (appearance) for a specific user by their user ID.
 * @param userId - The ID of the user whose theme is to be fetched.
 * @returns The theme (appearance) for the user.
 */
export async function getUserTheme(userId: string) {
    try {
        // Fetch the user's theme (appearance) from the database
        const theme: Appearance = await getUserTheme(userId);
        return theme; // Return the fetched theme
    } catch (error) {
        console.error('Failed to fetch user theme:', error); // Log any errors encountered
        throw new Error('Failed to fetch user theme.'); // Throw a user-friendly error message
    }
}

/**
 * Set the theme (appearance) for a specific user.
 * @param userId - The ID of the user whose theme is to be updated.
 * @param theme - The new theme (appearance) to be set (e.g., 'light' or 'dark').
 * @returns The updated theme after setting it in the database.
 */
export async function setUserTheme(userId: string, theme: string) {
    try {
        // Update the user's theme (appearance) in the database
        const setTheme: string = await setUserTheme(userId, theme);
        return setTheme; // Return the updated theme
    } catch (error) {
        console.error('Failed to set user theme:', error); // Log any errors encountered
        throw new Error('Failed to set user theme.'); // Throw a user-friendly error message
    }
}

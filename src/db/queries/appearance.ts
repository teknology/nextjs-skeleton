'use server';

import { db } from '../index'; // Import the Prisma database client
import { auth } from '../../auth'; // Import the authentication function
import { user } from '@nextui-org/react'; // UI framework import (possibly not needed in this file)

export type Appearance = 'light' | 'dark'; // Define appearance type as either 'light' or 'dark'

/**
 * Get the appearance settings for a user.
 * If no ID is provided, it will use the currently authenticated user's ID.
 * @param id - The user ID. If empty, the session user ID is used.
 * @returns The appearance settings for the user.
 */
export async function getAppearanceSettings(id: string = '') {
    // Get the authenticated session (if available)
    const session = await auth();

    // If no ID is provided, use the session's user ID
    if (id === null) {
        id = session?.user?.id as string;
    }

    // Fetch the appearance settings for the user from the database
    const appearance = await db.appearance.findUnique({
        where: { userId: id },
    });

    console.log('dbquery: appearance:', appearance); // Log the appearance settings

    return appearance;  // Return the appearance settings, if available
}

/**
 * Get the current theme for a user from the database.
 * Defaults to 'light' if no theme is set.
 * @param uid - The user ID.
 * @returns The current theme for the user or 'light' if not set.
 */
export async function getThemeInDb(uid: string) {
    // Get the authenticated session (if available)
    const session = await auth();

    // Log the session user ID and the passed user ID for debugging
    console.log('dbquery: session userid', session?.user?.id);
    console.log('dbquery: userid', uid);

    try {
        // Fetch the theme for the user from the appearance settings in the database
        const theme = await db.appearance.findUnique({
            where: { userId: uid },
        });

        console.log('dbquery: theme:', theme); // Log the theme for debugging

        // Return the user's theme or default to 'light' if none is set
        return theme?.theme || 'light';

    } catch (error) {
        console.error('Failed to fetch user:', error); // Log any error encountered during the fetch
        throw new Error('Failed to fetch user.'); // Throw an error to the calling function
    }
}

/**
 * Set or update the theme for a user in the database.
 * If the user has no appearance settings, create a new entry.
 * @param userId - The user ID (optional, will default to session user ID if not provided).
 * @param theme - The theme to set ('light' or 'dark').
 * @returns The updated or newly created appearance settings.
 */
export async function setThemeInDb(userId: string = '', theme: string) {
    // Get the authenticated session (if available)
    const session = await auth();

    // If no userId is provided, use the session's user ID
    if (userId === null) {
        userId = session?.user?.id as string;
    }

    // Upsert the theme in the database:
    // - If the user already has appearance settings, update them.
    // - If the user doesn't have appearance settings, create a new entry.
    const setTheme = await db.appearance.upsert({
        where: { userId: userId },
        update: { theme }, // Update the theme if it already exists
        create: { userId: userId, theme }, // Create a new entry if it doesn't exist
    });

    return setTheme; // Return the updated or created appearance settings
}

'use server';

import { db } from '@/db'; // Import the Prisma database client
import { auth } from '@/auth'; // Import the authentication function
import type { User, Profile } from '@prisma/client'; // Import types from Prisma schema

// Export the imported types for usage in other parts of the application
export type { User };
export type { Profile };

/**
 * Fetch profile by user ID.
 * If no user ID is provided, it will use the ID from the current authenticated session.
 * @param userId - The ID of the user (optional, default is an empty string).
 * @returns The profile of the user or null if not found.
 */
export async function getProfileByUserId(userId: string = ""): Promise<Profile | null> {
    const session = await auth(); // Get the authenticated session

    try {
        // Fetch the profile based on the session's user ID
        const profile = await db.profile.findUnique({
            where: {
                userId: session?.user?.id,
            },
        });
        return profile as Profile | null; // Return the profile if found, otherwise return null
    } catch (error) {
        console.error('Failed to fetch user:', error); // Log any errors encountered
        throw new Error('Failed to fetch user.'); // Throw a user-friendly error
    }
}

/**
 * Update the profile for the current authenticated user.
 * @param data - The profile data to update.
 * @returns The updated profile, an error message, or null if no data was provided.
 */
export async function updateProfile(data: Profile): Promise<Profile | string | null> {
    if (Object.keys(data).length !== 0) { // Check if the provided data is not empty
        try {
            const session = await auth(); // Get the authenticated session
            // Update the profile for the user based on their user ID
            const profile = await db.profile.update({
                where: {
                    userId: session?.user?.id,
                },
                data: {
                    ...data, // Update the profile with the provided data
                },
            });
            return profile; // Return the updated profile
        } catch (error) {
            console.error('Failed to update user:', (error as Error).message); // Log the error message
            return (error as Error).message; // Return the error message
        }
    }
    return null; // Return null if no data was provided
}

/**
 * Create a new profile for a user.
 * @param userId - The ID of the user to create a profile for.
 * @param profileData - The data for the new profile.
 * @returns The newly created profile or null if the operation fails.
 */
export async function createProfile(userId: string, profileData: Omit<Profile, 'id'> & { email: string }): Promise<Profile | null> {
    try {
        // Create a new profile for the given user
        const profile = await db.profile.create({
            data: {
                ...profileData,
            },
        });
        return profile; // Return the newly created profile
    } catch (error) {
        console.error('Failed to create profile:', error); // Log any errors encountered
        throw new Error('Failed to create profile.'); // Throw a user-friendly error
    }
}

/**
 * Delete a profile by user ID.
 * @param userId - The ID of the user whose profile should be deleted.
 * @returns A success message if the profile is deleted, or null if it fails.
 */
export async function deleteProfileByUserId(userId: string): Promise<string | null> {
    try {
        // Delete the profile for the given user ID
        await db.profile.delete({
            where: {
                userId,
            },
        });
        return 'Profile deleted successfully'; // Return a success message
    } catch (error) {
        console.error('Failed to delete profile:', error); // Log any errors encountered
        return null; // Return null if the deletion fails
    }
}



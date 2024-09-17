'use server';

import { getProfileByUserId, updateProfile } from '@/db/queries/profile';
import { getUserWithProfileById } from '@/db/queries/user';
import { auth } from '@/auth';
import { db } from '@/db';

// Interface for Address Form State


// Function to get all addresses associated with the profile



// Function to get the billing address associated with the profile




export async function updateProfileSettings(
    formState: any,
    formData: FormData
): Promise<any> {
    try {
        const currentProfile = await getProfileByUserId() as { [key: string]: any };
        const profileData: any = {};

        formData.forEach((value, key) => {
            // Exclude keys that contain $ACTION using regex
            const regex = /\$ACTION/;
            if (!regex.test(key) && value !== currentProfile[key]) {
                profileData[key] = value;
            }
        });

        // Only send data if there's something to update
        if (Object.keys(profileData).length === 0) {
            return {
                status: 'no_change',
                errors: {},
            };
        }

        const newData = await updateProfile(profileData);

        return {
            status: 'success',
            errors: {},
        };
    } catch (error) {
        console.error('Failed to update profile:', error);
        throw new Error('Failed to update profile.');
    }
}


// Function to get profile settings (as previously defined)
export async function getProfileSettings() {
    try {
        const profile = await getUserWithProfileById();

        console.log('profile', profile);

        return profile
    } catch (error) {
        console.error('Failed to fetch profile settings:', error);
        throw new Error('Failed to fetch profile settings.');
    }
}
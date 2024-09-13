'use server';

import { getProfileByUserId, updateProfile } from '@/db/queries/profile';
import { getUserWithProfileById } from '@/db/queries/user';
import { auth } from '@/auth';
import { db } from '@/db';



// Function to update profile settings (as previously defined)
export async function updateProfileSettings(
    formState: any,
    formData: FormData
): Promise<any> {
    try {
        const currentProfile = await getProfileByUserId() as { [key: string]: any };
        const profileData: any = {};

        formData.forEach((value, key) => {
            if (value !== currentProfile[key]) {
                profileData[key] = value;
            }
        });

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
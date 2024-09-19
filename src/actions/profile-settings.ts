'use server';

import { getProfileByUserId, updateProfile } from '@/db/queries/profile';
import { getUserWithProfileById } from '@/db/queries/user';
import { auth } from '@/auth';
import { db } from '@/db';
import { profileSchema } from '@/utils/validation-schemas'

interface ProfileFormState {
    status?: 'idle' | 'success' | 'no_change';
    errors: {
        firstName?: string[];
        lastName?: string[];
        biography?: string[];
        title?: string[];
        email?: string[];
        phoneNumber?: string[];
        countryCodeId?: string[];
        timezoneId?: string[];
        _form?: string[];
    }


}

export async function updateProfileSettings(
    formState: ProfileFormState,
    formData: FormData
): Promise<ProfileFormState> {
    const result = profileSchema.safeParse({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        biography: formData.get('biography'),
        title: formData.get('title'),
        phoneNumber: Number(formData.get('phoneNumber')),
        email: formData.get('email'),
        countryCodeId: Number(formData.get('countryCodeId')),
        timezoneId: Number(formData.get('timezoneId'))
    });



    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors
        };
    }
    try {
        const currentProfile = await getProfileByUserId() as { [key: string]: any };
        const profileData: any = {};

        formData.forEach((value, key) => {
            // Exclude keys that contain $ACTION using regex
            const regex = /\$ACTION/;



            if (!regex.test(key) && value !== currentProfile[key]) {

                if (key === 'countryCodeId' || key === 'timezoneId' || key === 'phoneNumber') {
                    profileData[key] = Number(value);
                    return;
                }

                profileData[key] = value;
            }
        });

        console.log('profileData:actionfile', profileData);
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

        return {
            status: 'idle',
            errors: {
                _form: ['Failed to update profile settings']

            }
        }
    }
}


// Function to get profile settings (as previously defined)
export async function getProfileSettings() {
    try {
        const profile = await getUserWithProfileById();

        console.log('profile:actionfile', profile);

        return profile
    } catch (error) {
        console.error('Failed to fetch profile settings:', error);
        throw new Error('Failed to fetch profile settings.');
    }
}
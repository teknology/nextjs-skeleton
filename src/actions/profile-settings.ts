
'use server'
import { getProfileByUserId, updateProfile } from '@/db/queries/profile';
import { getUserWithProfileById } from '@/db/queries/user';
import { Profile } from '@prisma/client';
import { auth } from '@/auth';
import { getUserById } from '@/db/queries/user';
import * as actions from '@/actions';

export async function getProfileSettings() {
    const session = await auth();
    const userId = session?.user?.id
    console.log('userId:ActionFile', userId);

    try {

        if (userId) {

            const profileData = await getUserWithProfileById(userId)

            console.log('profileData:ActionFile', profileData);
            // const userData = await getUserById(userId)

            // console.log('profileData:ActionFile', profileData);
            if (profileData) {
                return profileData;
            }

            // Test if this can happen in production
            throw new Error('Profile not found. You may need to log out and log back in');
        } else {
            throw new Error('User ID is undefined.');
        }
    }
    catch (error) {
        console.error('Failed to fetch user:', error);
        // actions.signOut();
        throw new Error('Failed to fetch user.');
    }

}

interface ProfileSettingsFormState {
    status?: 'idle' | 'pending' | 'success' | 'error';
    errors: {
        first_name?: string[];
        last_name?: string[];
        title?: string[];
        biography?: string[];
        email?: string[];
        phone?: number[];
        timezoneId?: number[];
        countryCodeId?: number[];
        _form?: string[];
    };
}
export async function updateProfileSettings(
    formState: ProfileSettingsFormState,
    formData: FormData
): Promise<ProfileSettingsFormState> {

    try {
        const currentProfile = await getProfileByUserId() as { [key: string]: any };
        const currentUser = await getUserById();

        const profileData: any = {};
        const userData: any = {};

        const actionRegex = /\$ACTION/;
        const numberRegex = /^[+-]?\d+(\.\d+)?$/;

        const phoneNumber = formData.get('phoneNumber') as string | null;

        formData.forEach((value, key) => {
            let formValue = value as any;

            if (actionRegex.test(key)) {
                return;
            }

            // Check if the form value is a number
            if (numberRegex.test(formValue)) {
                formValue = Number(formValue);
            }

            // Handle user fields separately TODO: Recode to use the db query function that pulls the user data and profile data
            if (key === 'email' && formValue !== currentUser?.email) {
                userData.email = formValue;
            }

            // Compare form data with current profile data
            if (formValue !== currentProfile[key] && key !== 'email') {

                profileData[key] = formValue;
            }
        });

        const newData = updateProfile(profileData);

        console.log('newData', newData)


        return {

            status: 'success',
            errors: {}
        };

        // Implement the logic to update the profile and user data in the database
        // return await updateProfile(profileData);
    } catch (error) {
        console.error('Failed to update user:', error);
        throw new Error('Failed to update user.');
    }
}
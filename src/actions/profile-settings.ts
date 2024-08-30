
'use server'
import { getProfileByUserId, updateProfile } from '@/db/queries/profile';
import { Profile } from '@prisma/client';
import { auth } from '@/auth';
import { getUserById } from '@/db/queries/user';

export async function getProfileSettings() {
    const session = await auth();
    const userId = session?.user?.id

    try {

        if (userId) {

            const profileData = await getProfileByUserId(userId)

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
        throw new Error('Failed to fetch user.');
    }

}

interface ProfileSettingsFormState {
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

        console.log('regex test', numberRegex.test('1234567890')); // Expected output: true
        const phoneNumber = formData.get('phoneNumber') as string | null;
        console.log('regex test form', phoneNumber && numberRegex.test(phoneNumber)); // Expected output

        formData.forEach((value, key) => {
            let formValue = value as any;

            if (actionRegex.test(key)) {
                return;
            }

            // Check if the form value is a number
            if (numberRegex.test(formValue)) {
                formValue = Number(formValue);
            }

            // Handle user fields separately
            if (key === 'email' && formValue !== currentUser?.email) {
                userData.email = formValue;
            }

            // Compare form data with current profile data
            if (formValue !== currentProfile[key] && key !== 'email') {
                console.log('key', typeof currentProfile[key]);
                console.log('formValue', typeof formValue);
                profileData[key] = formValue;
            }
        });

        updateProfile(profileData);
        console.log('profileData to update', profileData);
        console.log('userData to update', userData);

        return {
            errors: {}
        };

        // Implement the logic to update the profile and user data in the database
        // return await updateProfile(profileData);
    } catch (error) {
        console.error('Failed to update user:', error);
        throw new Error('Failed to update user.');
    }
}
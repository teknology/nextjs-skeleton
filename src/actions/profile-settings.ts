
'use server'
import { getProfileByUserId, updateProfile } from '@/db/queries/profile';
import { Profile } from '@/utils/types/types';
import { auth } from '@/auth';

export async function getProfileSettings() {
    const session = await auth();
    const userId = session?.user?.id

    //console.log(session)

    try {

        if (userId) {
            return await getProfileByUserId(userId);
        } else {
            throw new Error('User ID is undefined.');
        }
    }
    catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }

}

interface ProfileFormState {
    errors: {
        first_name?: string[];
        last_name?: string[];
        email?: string[];
        phone?: string[];
        timezoneId?: string[];
        countryCodeId?: string[];
        _form?: string[];
    };
}
export async function updateProfileSettings(
    formState: ProfileFormState,
    formData: FormData
): Promise<ProfileFormState> {
    try {
        const data = {
            firstName: formData.get('first_name') as string,
            lastName: formData.get('last_name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            timezoneId: formData.get('timezoneId') as string,
            countryCodeId: formData.get('countryCodeId') as string,
        };



        return await updateProfile(data);
    }
    catch (error) {
        console.error('Failed to update user:', error);
        throw new Error('Failed to update user.');
    }
}
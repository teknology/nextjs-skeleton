
'use server'
import { getUserProfile } from '@/db/queries/profile';
import { Profile } from '@/utils/types/types';
import { auth } from '@/auth';

export async function getProfile() {
    const session = await auth();
    const userId = session?.user?.id

    // console.log(session)

    try {

        if (userId) {
            return await getUserProfile(userId);
        } else {
            throw new Error('User ID is undefined.');
        }
    }
    catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }

}
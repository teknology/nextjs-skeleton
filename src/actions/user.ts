'use server'
import { getUserByEmail } from '@/db/queries/user';

export async function findUserByEmail(userEmail: string) {
    try {
        const user = await getUserByEmail(userEmail);
        console.log('action call', user)
        return user;
    }
    catch (error) {
        console.error('Failed to find user:', error);
        throw new Error('Failed to find user.');

    }



}
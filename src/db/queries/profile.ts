'use server'
import { db } from '@/db';
import { auth } from '@/auth';

export async function getUserProfile(userId: string) {

    const session = await auth();
    try {
        return await db.profile.findUnique({
            where: { userId: session?.user?.id },
        });



    }
    catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}
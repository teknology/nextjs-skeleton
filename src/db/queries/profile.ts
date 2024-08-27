'use server'
import { db } from '@/db';
import { auth } from '@/auth';
import type { User, Profile } from '@prisma/client';

export type { User };
export type { Profile };




export async function getProfileByUserId(userId: string): Promise<Profile | null> {
    const session = await auth();
    try {
        const profile = await db.profile.findUnique({
            where: {
                userId: session?.user?.id,
            },

        });

        console.log('profile Dada:', profile);

        return profile;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export async function updateProfile(data: Profile): Promise<Profile> {
    try {
        const session = await auth();
        const profile = await db.profile.update({
            where: {
                userId: session?.user?.id,
            },
            data: {
                ...data,
            },
        });

        return profile;
    } catch (error) {
        console.error('Failed to update user:', error);
        throw new Error('Failed to update user.');
    }
}


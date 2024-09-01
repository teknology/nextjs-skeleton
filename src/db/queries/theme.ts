'use server'
import { db } from '../index';
import { auth } from '../../auth';
import { user } from '@nextui-org/react';

export type Appearance = 'light' | 'dark';

export async function getUserAppearance(userId: string | null = '') {
    const session = await auth();

    if (userId === null) {
        userId = session?.user?.id as string;
    }

    const appearance = await db.appearance.findFirst({
        where: { userId },
    });

    return appearance || '0';  // Default to light theme
}

export async function getUserTheme(id: string) {
    const session = await auth();

    console.log('dbquery: session userid', session?.user?.id)
    console.log('dbquery: userid', id)

    try {
        const theme = await db.appearance.findUnique({
            where: { userId: id },
        });

        console.log('dbquery: theme:', theme)

        return theme?.theme || 'light';  // Default to light theme

    }
    catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export async function setUserTheme(userId: string = '', theme: string) {
    const session = await auth();
    if (userId === null) {
        userId = session?.user?.id as string;
    }
    const setTheme = await db.appearance.upsert({
        where: { userId: userId },
        update: { theme },
        create: { userId: userId, theme },
    });

    return setTheme;
}
import { db } from '../index';
import { auth } from '../../auth';

export async function getUserTheme(userId: string | null = '') {
    const session = await auth();

    if (userId === null) {
        userId = session?.user?.id as string;
    }

    const appearance = await db.appearance.findFirst({
        where: { userId },
    });

    return appearance?.theme || '0';  // Default to light theme
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
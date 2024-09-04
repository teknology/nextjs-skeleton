'use server'
import { auth } from '@/auth';
import { getAppearanceSettings as getData } from '@/db/queries/appearance';
import type { Appearance } from '@prisma/client';

export async function getAppearanceSettings() {
    const session = await auth();
    const userId = session?.user?.id
    console.log('userId:ActionFile', userId);

    try {

        if (userId) {

            const appearanceData = await getData(userId)

            // TODO: Find out a way to trim down the data to only the necessary fields
            console.log('appearanceData:ActionFile', appearanceData);
            // const userData = await getUserById(userId)

            // console.log('profileData:ActionFile', profileData);
            if (appearanceData) {
                return appearanceData;
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


export async function getUserTheme(userId: string) {
    try {
        // Fetch user theme
        const theme: Appearance = await getUserTheme(userId);
        return theme;
    } catch (error) {
        console.error('Failed to fetch user theme:', error);
        throw new Error('Failed to fetch user theme.');
    }
}

export async function setUserTheme(userId: string, theme: string) {
    try {
        // Set user theme
        const setTheme: string = await setUserTheme(userId, theme);
        return setTheme;
    } catch (error) {
        console.error('Failed to set user theme:', error);
        throw new Error('Failed to set user theme.');
    }
}
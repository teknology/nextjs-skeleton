// src/app/theme-actions.ts
'use server';

import { get } from 'http';
//Find out why  @ directory reference doesn't work
import { auth } from '../auth'; // Assuming the 'auth' module is located in the 'auth' directory relative to the current file
import { getThemeInDb, setThemeInDb } from '../db/queries/appearance';
import { cookies } from 'next/headers'




//import { getServerSession } from 'next-auth'; // Assuming you're using next-auth for authentication

export async function getThemefromDBAction() {
    const session = await auth();


    if (!session?.user?.id) {
        return 'light'; // Default to light theme
    }
    try {
        const theme = await getThemeInDb(session?.user?.id);
        return theme;
    }
    catch (error) {
        console.error('Failed to fetch user theme:', error);
        throw new Error('Failed to fetch user theme.');
    }
}

export async function setThemeinDBAction(theme: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    try {
        // Assuming setTheme is a function that sets the theme
        const setTheme = await setThemeInDb(session.user.id, theme);
        return setTheme;
    }
    catch (error) {
        console.error('Failed to set user theme:', error);
        throw new Error('Failed to set user theme.');
    }
}
/*
export async function setUserTheme(formState: AppearanceThemeFormState,
    formData: FormData): Promise<void> {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    try {
        // Assuming setTheme is a function that sets the theme
        const setTheme = await setTheme(session.user.id, formData);
        return setTheme;
    }
    catch (error) {
        console.error('Failed to set user theme:', error);
        throw new Error('Failed to set user theme.');
    }
}
   */

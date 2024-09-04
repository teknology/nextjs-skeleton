// src/app/theme-actions.ts
'use server';

import { get } from 'http';
//Find out why  @ directory reference doesn't work
import { auth } from '../auth'; // Assuming the 'auth' module is located in the 'auth' directory relative to the current file
import { getUserTheme as getTheme } from '../db/queries/appearance';



//import { getServerSession } from 'next-auth'; // Assuming you're using next-auth for authentication

export async function getUserTheme() {
    const session = await auth();


    if (!session?.user?.id) {
        return 'light'; // Default to light theme
    }
    try {
        const theme = await getTheme(session?.user?.id);
        return theme;
    }
    catch (error) {
        console.error('Failed to fetch user theme:', error);
        throw new Error('Failed to fetch user theme.');
    }
}

interface AppearanceThemeFormState {
    status?: 'idle' | 'pending' | 'success' | 'error';
    errors: {
        theme?: string[];
        _form?: string[];
    };
}

/*export async function setUserTheme(formState: AppearanceThemeFormState,
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

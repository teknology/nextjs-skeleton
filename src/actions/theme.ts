// src/app/theme-actions.ts
'use server';

import { get } from 'http';
//Find out why  @ directory reference doesn't work
import { auth } from '../auth'; // Assuming the 'auth' module is located in the 'auth' directory relative to the current file
import { getUserTheme } from '../db/queries/theme';



//import { getServerSession } from 'next-auth'; // Assuming you're using next-auth for authentication

export async function getUserTheme() {
    const session = await auth();


    if (!session?.user?.id) {
        return '0'; // Default to light theme
    }
    try {
        const theme = await getUserTheme();
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

export async function setUserTheme(formState: AppearanceThemeFormState,
    formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    try {
        const setTheme = await setUserTheme(Id);
        return setTheme;
    }
    catch (error) {
        console.error('Failed to set user theme:', error);
        throw new Error('Failed to set user theme.');
    }


}

'use server'
// src/utils/getTheme.ts
import { cookies } from 'next/headers';

export async function getInitialTheme() {
    const themeCookie = await cookies().get('theme');
    return themeCookie?.value;
}

export async function setThemeCookie(theme: string) {
    cookies().set('theme', theme, {
        maxAge: 60 * 60 * 24 * 365,
    });
}
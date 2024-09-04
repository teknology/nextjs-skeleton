// src/utils/getTheme.ts
import { cookies } from 'next/headers';

export function getInitialTheme() {
    const themeCookie = cookies().get('theme');
    return themeCookie?.value || 'light';
}

export function setThemeCookie(theme: string) {
    cookies().set('theme', theme, {
        maxAge: 60 * 60 * 24 * 365,
    });
}
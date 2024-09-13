'use server'
import { getLocaleList, getLocaleByUserId } from "@/db/queries/locale";

export async function getLocales() {
    return getLocaleList();
}

export async function getLocaleByUser(userId: string = ''): Promise<any> {
    try {
        const userLocale = await getLocaleByUserId();

        console.log('User Locale', userLocale);
        return userLocale;
    }

    catch (error) {
        console.error('Failed to fetch locale by user ID:', error);
        throw new Error('Failed to fetch locale.');
    }





}
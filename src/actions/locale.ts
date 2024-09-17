'use server'
import { getLocaleList, getLocaleByUserId, saveUserLocale } from "@/db/queries/locale";

export async function getLocales() {
    try {
        const locales = await getLocaleList();

        // console.log('Locales:ActionFile', locales);
        return locales;

    }
    catch (error) {
        console.error('Failed to fetch locales:', error);
        throw new Error('Failed to fetch locales.');
    }

}

export async function getLocaleByUser(userId: string = ''): Promise<any> {
    try {
        const userLocale = await getLocaleByUserId();

        console.log('UserLocale:ActionFile', userLocale);
        return userLocale;
    }

    catch (error) {
        console.error('Failed to fetch locale by user ID:', error);
        throw new Error('Failed to fetch locale.');
    }





}

export async function saveLocale(userId: string, localeId: number): Promise<any> {
    try {
        const userLocale = await saveUserLocale(userId, localeId);

        console.log('UserLocale:ActionFile', userLocale);
        return userLocale;
    }

    catch (error) {
        console.error('Failed to save locale by user ID:', error);
        throw new Error('Failed to save locale.');
    }
}
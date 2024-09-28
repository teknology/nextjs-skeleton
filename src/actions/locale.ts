'use server'
import { getLocaleList, getLocaleByUserId, saveUserLocale } from "@/db/queries/locale";
import { readdirSync } from 'fs';
import { revalidatePath } from "next/cache";
import { join } from 'path';



/*
export async function getAvailableLocales() {
    // Adjust the path to point to the messages folder outside of src
    const messagesDir = join(process.cwd(), 'messages'); // `messages` folder outside of `src`

    // Read the directory and get the list of files
    const files = readdirSync(messagesDir);

    // Extract locale codes (e.g., from `en.json`, `de.json`)
    const locales = files.map(file => file.replace('.json', ''));

    return locales; // Return the list of locales
}
*/

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

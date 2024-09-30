import { auth } from "@/auth";
import { db } from "@/db";
import { user } from "@nextui-org/react";

// Accepting locales as a parameter
// Accepting locales as a parameter and spreading it into a new mutable array
export async function getActiveLocales(locales: readonly string[]) {
    try {
        const activeLocales = await db.locale.findMany({
            where: {
                code: {
                    in: [...locales], // Spread the readonly array into a new mutable array
                },
            },
            select: {
                id: true,
                code: true,
                country: true,
                language: true,
                flag: true,
            },
        });

        return activeLocales;
    } catch (error) {
        console.error('Error fetching active locales:', error);
        throw error;
    }
}
export async function getLocaleList() {

    return db.locale.findMany({
        select: {
            id: true,
            code: true,
            language: true,
            flag: true,
        },
    });
}

export async function getLocaleByUserId(userId: string = '') {

    if (!userId) {
        const session = await auth();
        userId = session?.user?.id as string;
    }

    try {
        const userAccount = await db.account.findFirst({
            where: { userId },

        });

        const userLocaleID = await db.locale.findUnique({
            where: { id: userAccount?.localeId ?? undefined },
        });

        const userLocale = userLocaleID?.id;

        return userLocale || null;
    } catch (error) {
        console.error('Failed to fetch locale by user ID:', error);
        throw new Error('Failed to fetch locale.');
    }

}

export async function saveUserLocale(userId: string = "", localeId: number) {

    if (!userId) {
        const session = await auth();
        userId = session?.user?.id as string;
    }

    if (!userId) {
        throw new Error('User not authenticated.');
    }

    try {
        const userProfile = await db.profile.findFirst({
            where: { userId },
        });

        if (!userProfile) {
            throw new Error('User profile not found.');
        }

        const updatedProfile = await db.profile.update({
            where: { id: userProfile.id },
            data: {
                localeId,
            },
        });

        return updatedProfile;
    } catch (error) {
        console.error('Failed to save locale by user ID:', error);
        throw new Error('Failed to save locale.');
    }

}
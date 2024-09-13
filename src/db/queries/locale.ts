import { auth } from "@/auth";
import { db } from "@/db";
import { user } from "@nextui-org/react";

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
        const userProfile = await db.profile.findFirst({
            where: { userId },

        });



        const userLocale = await db.locale.findUnique({
            where: { id: userProfile?.localeId ?? undefined },
        });

        console.log('User Locale:db query', userLocale);

        return userLocale?.code || null;
    } catch (error) {
        console.error('Failed to fetch locale by user ID:', error);
        throw new Error('Failed to fetch locale.');
    }

}
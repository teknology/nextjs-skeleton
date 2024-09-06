
'use server'
import { db } from '@/db';

export async function saveProviderAccount(uId: string, account: any) {

    const providerAccount = await db.providerAccount.findUnique({
        where: {
            userId: uid,
        },

    });


}


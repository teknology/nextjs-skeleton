'use server'

import { db } from '@/db';
import { CountryCode } from '@prisma/client';

export type { CountryCode };

export async function getCountryList(): Promise<CountryCode[]> {
    const countryList = await db.countryCode.findMany({
        select: {
            id: true,
            code: true,
            country: true,
            alpha2: true,
            alpha3: true,
            flag: true,
        },
    });

    return countryList;
}
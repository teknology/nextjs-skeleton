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

export async function getStateProvinceByCountryCodeId(countryCodeId: number) {

    // TODO: Modify this to use findUnique instead of findFirst
    const stateProvinceList = await db.stateProvince.findFirst({
        where: { countryCodeId },
        select: {
            id: true,
            name: true,
            code: true,
        },
    });

    console.log('StateProvinceList', stateProvinceList);

    return stateProvinceList;
}
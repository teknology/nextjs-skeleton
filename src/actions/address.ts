'use server';

import { getMailingAddressByUserId } from "@/db/queries/address";

export async function getMailingAddress() {
    try {

        const mailingAddress = await getMailingAddressByUserId();
        console.log('Mailing Address', mailingAddress)

        return mailingAddress;
    } catch (error) {
        console.error('Failed to fetch mailing address:', error);
        //   throw new Error('Failed to fetch mailing address.');
    }
}


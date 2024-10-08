'use server';

import { z } from 'zod';
import { addressSchema } from '@/utils/validation-schemas';
import { getAccountWithAddressesByUserId, updateAccountWithAddress } from '@/db/queries/account';
import type { AddressTypeEnum } from '@prisma/client';


interface AccountFormState {
    status?: 'idle' | 'success' | 'no_change' | 'error';
    errors: {
        mailingAddress1?: string[];
        mailingAddress2?: string[] | null;
        mailingCity?: string[];
        mailingState?: string[];
        mailingZipcode?: string[];
        mailingCountry?: string[];
        mailingAddressType?: string[];
        billingAddress1?: string[];
        billingAddress2?: string[] | null;
        billingCity?: string[];
        billingState?: string[];
        billingZipcode?: string[];
        billingCountry?: string[];
        billingAddressType?: string[];
        localId?: string[];
        _form?: string[];
    };
}
export async function getAccountSettings() {
    // Try to execute the code within this block
    try {
        // Call the function getAccountWithAddressesByUserId and wait for its result
        const data = await getAccountWithAddressesByUserId();

        // If the function call is successful, return the received data
        return data;
    }
    // Catch any errors that occur during the execution of the try block
    catch (error) {
        // Throw a new error with a custom message, indicating that fetching account settings failed
        throw new Error('Failed to fetch Account settings.');
    }
}

// Assuming Address is a defined type


export async function updateAccountSettings(formState: AccountFormState, formData: FormData): Promise<AccountFormState> {




    // Map the formData to match the form structure exactly, without the removed fields
    const mailingAddress = {
        address1: formData.get('mailingAddress1') as string,
        address2: formData.get('mailingAddress2') as string, // optional
        city: formData.get('mailingCity') as string,
        stateProvinceId: Number(formData.get('mailingStateCodeId')),
        zipcode: formData.get('mailingZipcode') as string,
        countryCodeId: Number(formData.get('mailingCountryCodeId')),
        addressType: formData.get('mailingAddressType') as AddressTypeEnum,
    };

    const billingAddress = {
        address1: formData.get('billingAddress1') as string,
        address2: formData.get('billingAddress2') as string, // optional
        city: formData.get('billingCity') as string,
        stateProvinceId: Number(formData.get('billingStateCodeId')),
        zipcode: formData.get('billingZipcode') as string,
        countryCodeId: Number(formData.get('billingCountryCodeId')),
        addressType: formData.get('billingAddressType') as AddressTypeEnum,
    };

    const accountUpdateData = {
        locale: Number(formData.get('localeId')),
    };

    console.log('actionfile:mailingAddressResult', mailingAddress)

    // Validate the form data
    const mailingAddressResult = addressSchema.safeParse(mailingAddress);
    const billingAddressResult = addressSchema.safeParse(billingAddress);

    console.log("actionfile: validation result", mailingAddressResult)
    console.log("actionfile: validation result", mailingAddressResult.error?.flatten().fieldErrors)
    console.log("actionfile: validation result", billingAddressResult)

    if (!mailingAddressResult.success || !billingAddressResult.success) {
        return {
            errors: {
                mailingAddress1: mailingAddressResult.error?.flatten().fieldErrors.address1,
                mailingAddress2: mailingAddressResult.error?.flatten().fieldErrors.address2,
                mailingCity: mailingAddressResult.error?.flatten().fieldErrors.city,
                mailingState: mailingAddressResult.error?.flatten().fieldErrors.stateProvinceId,
                mailingZipcode: mailingAddressResult.error?.flatten().fieldErrors.zipcode,
                mailingCountry: mailingAddressResult.error?.flatten().fieldErrors.countryCodeId,
                mailingAddressType: mailingAddressResult.error?.flatten().fieldErrors.addressType,
                billingAddress1: billingAddressResult.error?.flatten().fieldErrors.address1,
                billingAddress2: billingAddressResult.error?.flatten().fieldErrors.address2,
                billingCity: billingAddressResult.error?.flatten().fieldErrors.city,
                billingState: billingAddressResult.error?.flatten().fieldErrors.stateProvinceId,
                billingZipcode: billingAddressResult.error?.flatten().fieldErrors.zipcode,
                billingCountry: billingAddressResult.error?.flatten().fieldErrors.countryCodeId,
                billingAddressType: billingAddressResult.error?.flatten().fieldErrors.addressType,

            }
        };
    }



    try {
        const result = await updateAccountWithAddress(accountUpdateData, mailingAddress, billingAddress);

        console.log('actionfile: dbquery result:', result)

        return {
            status: 'success',
            errors: {},
        };

    } catch (err: unknown) {
        if (err instanceof Error) {
            return {
                errors: {
                    _form: [err.message]
                },
            };
        } else {
            return {
                errors: {
                    _form: ['An unknown error occurred']
                }
            }
        }

    }

}
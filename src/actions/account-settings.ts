'use server';

import { z } from 'zod';
import { addressSchema } from '@/utils/validation-schemas';
import { getAccountWithAddressesByUserId, updateAccountWithAddress } from '@/db/queries/account';

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
        _form?: string[];
    };
}
export async function getAccountSettings() {
    try {
        const data = await getAccountWithAddressesByUserId();
        console.log('action:account-settings', data);
        return data;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch Account settings.');
        return null;
    }
}
export async function updateAccountSettings(formState: AccountFormState, formData: FormData): Promise<AccountFormState> {




    // Map the formData to match the form structure exactly, without the removed fields
    const mailingAddress = {
        address1: formData.get('mailingAddress1'),
        address2: formData.get('mailingAddress2')?.toString() || '', // optional
        city: formData.get('mailingCity')?.toString(),
        stateProvinceId: Number(formData.get('mailingStateId')),
        zipcode: formData.get('mailingZipcode'),
        countryCodeId: Number(formData.get('mailingCountry')),
        addressType: formData.get('mailingAddressType'),
    };

    const billingAddress = {
        address1: formData.get('billingAddress1'),
        address2: formData.get('billingAddress2') || '', // optional
        city: formData.get('billingCity'),
        stateProvinceId: Number(formData.get('billingStateId')),
        zipcode: formData.get('billingZipcode'),
        countryCodeId: Number(formData.get('billingCountry')),
        addressType: formData.get('billingAddressType'),
    };

    const accountUpdateData = {
        localeId: Number(formData.get('locale')),
    };

    console.log('actionfile:passedFormData', formData);

    // Validate the form data
    const mailingAddressResult = addressSchema.safeParse(mailingAddress);
    const billingAddressResult = addressSchema.safeParse(billingAddress);

    if (!mailingAddressResult.success || !billingAddressResult.success) {
        return {
            errors: {
                mailingAddress1: mailingAddressResult.error?.flatten().fieldErrors.address1,
                mailingAddress2: mailingAddressResult.error?.flatten().fieldErrors.address2,
                mailingCity: mailingAddressResult.error?.flatten().fieldErrors.city,
                mailingState: mailingAddressResult.error?.flatten().fieldErrors.stateProvinceId,
                mailingZip: mailingAddressResult.error?.flatten().fieldErrors.zipcode,
                mailingCountry: mailingAddressResult.error?.flatten().fieldErrors.countryCodeId,
                mailingAddressType: mailingAddressResult.error?.flatten().fieldErrors.addressType,
                billingAddress1: billingAddressResult.error?.flatten().fieldErrors.address1,
                billingAddress2: billingAddressResult.error?.flatten().fieldErrors.address2,
                billingCity: billingAddressResult.error?.flatten().fieldErrors.city,
                billingState: billingAddressResult.error?.flatten().fieldErrors.stateProvinceId,
                billingZip: billingAddressResult.error?.flatten().fieldErrors.zipcode,
                billingCountry: billingAddressResult.error?.flatten().fieldErrors.countryCodeId,
                billingAddressType: billingAddressResult.error?.flatten().fieldErrors.addressType,

            }
        };
    }

    console.log('actionfile:mailingAddress', mailingAddressResult);
    console.log('actionfile:billingAddress', billingAddressResult);



    try {
        const result = await updateAccountWithAddress(accountUpdateData, mailingAddress, billingAddress);

        return {
            status: 'success',
            errors: {},
        };
    } catch (error) {
        console.error('Failed to update account settings:', error);

        return {
            status: 'error',
            message: 'Failed to update account settings.',
        };
    }
}
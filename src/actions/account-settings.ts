'use server';

import { z } from 'zod';
import { profileSchema } from '@/validation/schemas'; // Import your Zod schema
import { addressSchema } from '@/utils/validation-schemas';

interface AccountFormState {
    status?: 'success' | 'no_change';
    errors: {
        mailingAddress1?: string[];
        mailingAddress2?: string[];
        mailingCity?: string[];
        mailingState?: string[];
        mailingZip?: string[];
        mailingCountry?: string[];
        mailingAddressType?: string[];
        billingAddress1?: string[];
        billingAddress2?: string[];
        billingCity?: string[];
        billingState?: string[];
        billingZip?: string[];
        billingCountry?: string[];
        billingAddressType?: string[];
        _form?: string[];
    };
}

export async function updateAccountSettings(formState: AccountFormState, formData: FormData): Promise<any> {
    // Map the formData to match the form structure exactly, without the removed fields

    const mailingAddress = {
        address1: formData.get('mailingAddress1')?.toString() || '',
        address2: formData.get('mailingAddress2')?.toString() || '', // optional
        city: formData.get('mailingCity')?.toString() || '',
        stateProvince: formData.get('mailingState')?.toString() || '',
        zipcode: formData.get('mailingZipcode')?.toString() || '',
        countryCode: formData.get('mailingCountry')?.toString() || '',
        addressType: formData.get('mailingAddressType')?.toString() || '',
    }
    const billingAddress = {
        address1: formData.get('billingAddress1')?.toString() || '',
        address2: formData.get('billingAddress2')?.toString() || '', // optional
        city: formData.get('billingCity')?.toString() || '',
        stateProvince: formData.get('billingState')?.toString() || '',
        zipcode: formData.get('billingZipcode')?.toString() || '',
        countryCode: formData.get('billingCountry')?.toString() || '',
        addressType: formData.get('billingAddressType')?.toString() || '',
    }
    const account = formData.get('locale')?.toString() || '' // Include locale as you had in the previous component


    // Validate the form data
    const mailingAddressResult = addressSchema.safeParse({ mailingAddress });
    const billingAddressResult = addressSchema.safeParse({ billingAddress });

    // If validation fails, return the validation errors

    if (!mailingAddressResult.success || !billingAddressResult.success) {
        return {
            errors: {
                mailingAddress1: mailingAddressResult.error?.errors[0]?.message,
                mailingAddress2: mailingAddressResult.error?.errors[1]?.message,
                mailingCity: mailingAddressResult.error?.errors[2]?.message,
                mailingState: mailingAddressResult.error?.errors[3]?.message,
                mailingZip: mailingAddressResult.error?.errors[4]?.message,
                mailingCountry: mailingAddressResult.error?.errors[5]?.message,
                billingAddress1: billingAddressResult.error?.errors[0]?.message,
                billingAddress2: billingAddressResult.error?.errors[1]?.message,
                billingCity: billingAddressResult.error?.errors[2]?.message,
                billingState: billingAddressResult.error?.errors[3]?.message,
                billingZip: billingAddressResult.error?.errors[4]?.message,
                billingCountry: billingAddressResult.error?.errors[5]?.message,
                _form: ['Invalid address data'],
            },
        };
    }



}

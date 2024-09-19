'use server'
import { getCountryList, getStateProvinceByCountryCodeId } from "@/db/queries/internationalization";
import { timezoneData } from "@/utils/data/timezones";

export async function getCountries() {

    try {
        const countryList = await getCountryList();
        return countryList;
    }
    catch (err: unknown) {
        if (err instanceof Error) {
            return {
                errors: {
                    _form: [err.message]
                }
            }
        } else {
            return {
                errors: {
                    _form: ['Failed to get country list']
                }
            }
        }
    }

}

export async function getTimezones() {



    return timezoneData;
}

export async function getStateProvince(countryCodeId: number) {

    try {
        const stateProvinceList = await getStateProvinceByCountryCodeId(countryCodeId);
        return stateProvinceList;
    }
    catch (err: unknown) {
        throw new Error('Failed to get state province list');
    }

}
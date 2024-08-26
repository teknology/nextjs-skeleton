import { getCountryList } from "@/db/queries/internationalization";
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
'use client';

import { Select, SelectItem, Skeleton } from "@nextui-org/react";
import { useEffect, useState } from "react";
import * as actions from '@/actions';
import { Country } from '@/utils/types/types';

interface CountrySelectProps {
    selectedCountryId?: number | null; // Optional prop to pass the selected country ID
}

export default function CountrySelect({ selectedCountryId }: CountrySelectProps) {
    const [countryCodes, setCountryCodes] = useState<Country[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);

    useEffect(() => {
        async function fetchCountries() {
            try {
                const result = await actions.getCountries();
                if (Array.isArray(result)) {
                    setCountryCodes(result);

                    if (selectedCountryId) {
                        const country = result.find(
                            (c: Country) => c.id === selectedCountryId
                        );
                        if (country) {
                            setSelectedCountry(String(country.id));
                        }
                    }
                } else {
                    console.error("Error fetching countries:", result.errors);
                }
            } catch (error) {
                console.error("Error fetching countries:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchCountries();
    }, [selectedCountryId]);

    return (
        <div className="w-full md:w-1/3">
            {loading ? (
                <Skeleton className="h-12 w-full rounded-lg mt-2" />
            ) : (
                <Select
                    label="Country Code"
                    placeholder="Select a country code"
                    className="max-w-13 mt-2"
                    selectedKeys={selectedCountry ? [selectedCountry] : undefined}
                    onSelectionChange={(keys) => setSelectedCountry(Array.from(keys)[0] as string)}
                >
                    {countryCodes.map((country) => (
                        <SelectItem key={country.id} value={String(country.id)}>
                            <div className="flex items-center">
                                <img
                                    src={country.flag}
                                    alt={`${country.country} flag`}
                                    className="inline-block w-6 h-4 mr-2"
                                />
                                {`${country.country} (${country.code})`}
                            </div>
                        </SelectItem>
                    ))}
                </Select>
            )}
        </div>
    );
}

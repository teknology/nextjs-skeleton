'use client';

import { useState, useEffect, forwardRef } from 'react';
import { Button, Input, Select, SelectItem, Spacer, Divider, Skeleton, Image } from '@nextui-org/react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';
import * as actions from '@/actions';
import { Country, Locale, StateProvince } from '@/utils/types/types';

interface AccountSettingCardProps {
    className?: string;
    loading?: boolean;
    data?: any;
}

const languageOptions = [
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' },
    { label: 'German', value: 'de' },
];

const addressTypeOptions = [
    { label: 'Residential', value: 'RESIDENTIAL' },
    { label: 'Commercial', value: 'COMMERCIAL' },
];

const AccountSetting = forwardRef<HTMLDivElement, AccountSettingCardProps>(
    ({ data, loading = false, className, ...props }, ref) => {
        const t = useTranslations('my_account.settings.profile');

        // Controlled input state
        const [address1, setAddress1] = useState(data?.address1 || '');
        const [address2, setAddress2] = useState(data?.address2 || '');
        const [city, setCity] = useState(data?.city || '');
        const [zipcode, setZipcode] = useState(data?.zipcode || '');
        const [addressType, setAddressType] = useState<string | undefined>(data?.addressType);

        const [stateCodes, setStateCodes] = useState<StateProvince[]>([]);
        const [countryCodes, setCountryCodes] = useState<Country[]>([]);
        const [localeCodes, setLocaleCodes] = useState<Locale[]>([]);

        const [selectedLocale, setSelectedLocale] = useState<string | null>(null);
        const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
        const [selectedState, setSelectedState] = useState<string | null>(null); // For selected state
        const [loadingStates, setLoadingStates] = useState(false); // State to handle loading of states

        console.log('Data:Client File', data);


        // Fetch countries on mount
        useEffect(() => {
            async function fetchLocales() {
                try {
                    const result = await actions.getLocales();

                    console.log('Locales:ClientFile', result);

                    if (Array.isArray(result)) {
                        setLocaleCodes(result);
                    } else {
                        console.error('Error fetching countries:');
                    }
                } catch (error) {
                    console.error('Error fetching countries:', error);
                }
            }
            console.log(fetchLocales());


        }, []);
        // Fetch countries on mount
        useEffect(() => {
            async function fetchCountries() {
                try {
                    const result = await actions.getCountries();
                    if (Array.isArray(result)) {
                        setCountryCodes(result);
                    } else {
                        console.error('Error fetching countries:', result.errors);
                    }
                } catch (error) {
                    console.error('Error fetching countries:', error);
                }
            }
            fetchCountries();
        }, []);

        // Fetch states when selectedCountry changes
        useEffect(() => {
            if (!selectedCountry) return;
            setLoadingStates(true);
            async function fetchStates() {
                try {
                    const countryId = parseInt(selectedCountry as string, 10); // Safely convert to number
                    if (isNaN(countryId)) {
                        throw new Error('Invalid country ID');
                    }
                    const result = await actions.getStateProvince(countryId);
                    if (Array.isArray(result)) {
                        setStateCodes(result as StateProvince[]);
                    } else {
                        console.error('Error fetching states:', result);
                    }
                } catch (error) {
                    console.error('Error fetching states:', error);
                } finally {
                    setLoadingStates(false);
                }
            }
            fetchStates();
        }, [selectedCountry, data?.state]);

        // Update the state when the data prop changes
        useEffect(() => {
            if (data) {
                setAddress1(data.address1 || '');
                setAddress2(data.address2 || '');
                setCity(data.city || '');
                setZipcode(data.zipcode || '');
                setAddressType(data.addressType || undefined);

                if (data.countryCodeId) {
                    setSelectedCountry(String(data.countryCodeId)); // Pre-select the country
                }

                if (data.stateProvinceId) {
                    setSelectedState(String(data.stateProvinceId)); // Pre-select the state
                }
                if (data.locale.id) {
                    setSelectedLocale(String(data.locale.id)); // Pre-select the locale

                }
            }
        }, [data]);

        return (
            <div ref={ref} className={cn('p-2', className)} {...props}>
                {/* Address Section */}
                <div>
                    <p className="text-base font-medium text-default-700">Mailing Address</p>
                    <p className="mt-1 text-sm font-normal text-default-400">
                        Please add an address for communication-related mail.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    {loading ? (
                        <Skeleton className="h-12 w-full rounded-lg mt-2" />
                    ) : (
                        <Input
                            name="address1"
                            className="mt-2"
                            placeholder="Address 1"
                            fullWidth
                            aria-label="Address line 1"
                            value={address1}
                            onChange={(e) => setAddress1(e.target.value)}
                        />
                    )}
                    {loading ? (
                        <Skeleton className="h-12 w-full rounded-lg mt-2" />
                    ) : (
                        <Input
                            name="address2"
                            className="mt-2"
                            placeholder="Address 2 (Optional)"
                            fullWidth
                            aria-label="Address line 2 (optional)"
                            value={address2}
                            onChange={(e) => setAddress2(e.target.value)}
                        />
                    )}
                </div>

                <Spacer y={2} />

                <div style={{ display: 'flex', gap: '16px' }}>
                    {loading ? (
                        <Skeleton className="h-12 w-full rounded-lg" />
                    ) : (
                        <Input
                            name="city"
                            className="mt-2"
                            placeholder="City"
                            fullWidth
                            aria-label="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    )}

                    {loading || loadingStates ? (
                        <Skeleton className="h-12 w-full rounded-lg" />
                    ) : (
                        <Select
                            name="state"
                            className="mt-2"
                            placeholder="Select State/Province"
                            fullWidth
                            aria-label="State or Province"
                            selectedKeys={selectedState ? [selectedState] : undefined} // Pre-select state if available
                            onSelectionChange={(keys) => setSelectedState(Array.from(keys)[0] as string)}
                        >
                            {stateCodes.map((state) => (
                                <SelectItem key={state.id} value={state.code}>
                                    {state.name}
                                </SelectItem>
                            ))}
                        </Select>
                    )}

                    {loading ? (
                        <Skeleton className="h-12 w-full rounded-lg" />
                    ) : (
                        <Input
                            className="mt-2"
                            placeholder="Zipcode"
                            fullWidth
                            aria-label="Zipcode"
                            value={zipcode}
                            onChange={(e) => setZipcode(e.target.value)}
                        />
                    )}
                </div>

                <Spacer y={2} />

                {/* Country and Address Type on the Same Row */}
                <div style={{ display: 'flex', gap: '16px' }}>
                    {/* Country Select */}
                    {loading ? (
                        <Skeleton className="h-12 w-full rounded-lg mt-2" />
                    ) : (
                        <Select
                            selectionMode="single"
                            label="Country"
                            className="mt-2"
                            name="countryCodeId"
                            placeholder="Select a country"
                            fullWidth
                            selectedKeys={selectedCountry ? [selectedCountry] : undefined}
                            onSelectionChange={(keys) => setSelectedCountry(Array.from(keys)[0] as string)}
                        >
                            {countryCodes.map((country) => (
                                <SelectItem
                                    key={country.id}
                                    value={String(country.id)}
                                    startContent={
                                        <Image
                                            src={country.flag}
                                            alt={`${country.country} flag`}
                                            className="inline-block w-6 h-4 mr-2"
                                        />
                                    }
                                    textValue={`${country.country}`}
                                >
                                    <div className="flex items-center">{`${country.country}`}</div>
                                </SelectItem>
                            ))}
                        </Select>
                    )}

                    {/* Address Type Select */}
                    {loading ? (
                        <Skeleton className="h-12 w-full rounded-lg mt-2" />
                    ) : (
                        <Select
                            selectionMode="single"
                            label="Address Type"
                            name="addressType"
                            className="mt-2"
                            placeholder="Select Address Type"
                            fullWidth
                            aria-label="Address Type"
                            selectedKeys={addressType ? [addressType] : undefined}
                            onSelectionChange={(event) => setAddressType(Array.from(event)[0] as string)}
                        >
                            {addressTypeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </Select>
                    )}
                </div>

                <Spacer y={2} />
                <Divider />
                <Spacer y={2} />

                {/* Language Selection */}
                <section>
                    <div>
                        <p className="text-base font-medium text-default-700">Language</p>
                        <p className="mt-1 text-sm font-normal text-default-400">Select your preferred language.</p>
                    </div>

                    {loading ? (
                        <Skeleton className="h-12 w-full rounded-lg" />
                    ) : (
                        <Select className="mt-2"
                            selectionMode="single"
                            selectedKeys={selectedLocale ? [selectedLocale] : undefined}
                            aria-label="Preferred language"
                            onSelectionChange={(keys) => setSelectedLocale(Array.from(keys)[0] as string)}
                        >
                            {localeCodes.map((locale) => (
                                <SelectItem key={locale.id} value={locale.code}>
                                    {locale.language}
                                </SelectItem>
                            ))}
                        </Select>
                    )}
                </section>

                <Spacer y={2} />

                {loading ? (
                    <Skeleton className="h-12 w-full rounded-lg mt-4" />
                ) : (
                    <Button className="mt-4 bg-default-foreground text-background" size="sm" aria-label="Update Account Settings">
                        Update Account
                    </Button>
                )}
            </div>
        );
    }
);

AccountSetting.displayName = 'AccountSetting';

export default AccountSetting;

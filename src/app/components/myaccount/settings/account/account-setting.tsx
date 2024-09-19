'use client';

import { useState, useEffect, forwardRef } from 'react';
import { Button, Input, Select, SelectItem, Spacer, Divider, Skeleton, Image } from '@nextui-org/react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';
import * as actions from '@/actions';
import { Country, Locale, StateProvince } from '@/utils/types/types';
import { useFormState } from 'react-dom';
import FormButton from '@/app/components/common/form-button';

interface AccountSettingCardProps {
    className?: string;
    loading?: boolean;
    data?: any;
}

const addressTypeOptions = [
    { label: 'Residential', value: 'RESIDENTIAL' },
    { label: 'Commercial', value: 'COMMERCIAL' },
];

const AccountSetting = forwardRef<HTMLDivElement, AccountSettingCardProps>(
    ({ data, loading = false, className, ...props }, ref) => {
        const t = useTranslations('my_account.settings.profile');

        // Controlled input state for mailing address
        const [mailingAddress1, setMailingAddress1] = useState(data?.mailingAddress?.address1 || '');
        const [mailingAddress2, setMailingAddress2] = useState(data?.mailingAddress?.address2 || '');
        const [mailingCity, setMailingCity] = useState(data?.mailingAddress?.city || '');
        const [mailingZipcode, setMailingZipcode] = useState(data?.mailingAddress?.zipcode || '');
        const [mailingCountry, setMailingCountry] = useState<string | null>(data?.mailingAddress?.countryCodeId || null);
        const [mailingState, setMailingState] = useState<string | null>(data?.mailingAddress?.stateProvinceId || null);
        const [mailingAddressType, setMailingAddressType] = useState<string | undefined>(data?.mailingAddress?.addressType);

        // Controlled input state for billing address
        const [billingAddress1, setBillingAddress1] = useState(data?.billingAddress?.address1 || '');
        const [billingAddress2, setBillingAddress2] = useState(data?.billingAddress?.address2 || '');
        const [billingCity, setBillingCity] = useState(data?.billingAddress?.city || '');
        const [billingZipcode, setBillingZipcode] = useState(data?.billingAddress?.zipcode || '');
        const [billingCountry, setBillingCountry] = useState<string | null>(data?.billingAddress?.countryCodeId || null);
        const [billingState, setBillingState] = useState<string | null>(data?.billingAddress?.stateProvinceId || null);
        const [billingAddressType, setBillingAddressType] = useState<string | undefined>(data?.billingAddress?.addressType);

        const [stateCodes, setStateCodes] = useState<StateProvince[]>([]);
        const [countryCodes, setCountryCodes] = useState<Country[]>([]);
        const [localeCodes, setLocaleCodes] = useState<Locale[]>([]);

        const [selectedLocale, setSelectedLocale] = useState<string | null>(data?.account?.localeId || null); // Preload user's locale
        const [loadingStates, setLoadingStates] = useState(false);
        const [formState, action] = useFormState(actions.updateAccountSettings, {
            status: 'idle',
            errors: {},
        });

        // Fetch countries and states on mount
        useEffect(() => {
            async function fetchCountriesAndStates() {
                try {
                    const countryResult = await actions.getCountries();
                    if (Array.isArray(countryResult)) {
                        setCountryCodes(countryResult);
                    }

                    const stateResult = await actions.getStateProvince(parseInt(mailingCountry || billingCountry || '0'));
                    if (Array.isArray(stateResult)) {
                        setStateCodes(stateResult);
                    }

                    const localeResult = await actions.getLocales(); // Fetch locales
                    if (Array.isArray(localeResult)) {
                        setLocaleCodes(localeResult);
                    }
                } catch (error) {
                    console.error('Error fetching countries, states, or locales:', error);
                }
            }

            fetchCountriesAndStates();
        }, [mailingCountry, billingCountry]);

        // Update state when data changes
        useEffect(() => {
            if (data) {
                // Update mailing address
                setMailingAddress1(data.mailingAddress?.address1 || '');
                setMailingAddress2(data.mailingAddress?.address2 || '');
                setMailingCity(data.mailingAddress?.city || '');
                setMailingZipcode(data.mailingAddress?.zipcode || '');
                setMailingCountry(String(data.mailingAddress?.countryCodeId || ''));
                setMailingState(String(data.mailingAddress?.stateProvinceId || ''));
                setMailingAddressType(data.mailingAddress?.addressType || undefined);

                // Update billing address
                setBillingAddress1(data.billingAddress?.address1 || '');
                setBillingAddress2(data.billingAddress?.address2 || '');
                setBillingCity(data.billingAddress?.city || '');
                setBillingZipcode(data.billingAddress?.zipcode || '');
                setBillingCountry(String(data.billingAddress?.countryCodeId || ''));
                setBillingState(String(data.billingAddress?.stateProvinceId || ''));
                setBillingAddressType(data.billingAddress?.addressType || undefined);

                // Update locale
                if (data.account?.localeId) {
                    setSelectedLocale(String(data.account?.localeId)); // Preload the user's locale
                }
            }
        }, [data]);

        return (
            <div ref={ref} className={cn('p-2', className)} {...props}>
                <form action={action}>
                    {/* Mailing Address Section */}
                    <div>
                        <p className="text-base font-medium text-default-700">Mailing Address</p>
                        <p className="mt-1 text-sm font-normal text-default-400">Please add an address for communication-related mail.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        {loading ? (
                            <Skeleton className="w-full h-12 rounded" />
                        ) : (
                            <Input
                                name="mailingAddress1"
                                className="mt-2"
                                placeholder="Address 1"
                                fullWidth
                                aria-label="Mailing Address line 1"
                                value={mailingAddress1}
                                onChange={(e) => setMailingAddress1(e.target.value)}
                            />
                        )}
                        {loading ? (
                            <Skeleton className="w-full h-12 rounded" />
                        ) : (
                            <Input
                                name="mailingAddress2"
                                className="mt-2"
                                placeholder="Address 2 (Optional)"
                                fullWidth
                                aria-label="Mailing Address line 2"
                                value={mailingAddress2}
                                onChange={(e) => setMailingAddress2(e.target.value)}
                            />
                        )}
                    </div>

                    <Spacer y={2} />

                    <div style={{ display: 'flex', gap: '16px' }}>
                        {loading ? (
                            <Skeleton className="w-full h-12 rounded" />
                        ) : (
                            <Input
                                name="mailingCity"
                                className="mt-2"
                                placeholder="City"
                                fullWidth
                                aria-label="Mailing City"
                                value={mailingCity}
                                onChange={(e) => setMailingCity(e.target.value)}
                            />
                        )}
                        {loading ? (
                            <Skeleton className="w-full h-12 rounded" />
                        ) : (
                            <Input
                                name='mailingZipcode'
                                className="mt-2"
                                placeholder="Zipcode"
                                fullWidth
                                aria-label="Mailing Zipcode"
                                value={mailingZipcode}
                                onChange={(e) => setMailingZipcode(e.target.value)}
                            />
                        )}
                    </div>

                    <Spacer y={2} />

                    <div style={{ display: 'flex', gap: '16px' }}>
                        {loading ? (
                            <Skeleton className="w-full h-12 rounded" />
                        ) : (
                            <Select
                                selectionMode="single"
                                label="Country"
                                className="mt-2"
                                name="mailingCountryId"
                                placeholder="Select a country"
                                fullWidth
                                selectedKeys={mailingCountry ? [mailingCountry] : undefined}
                                onSelectionChange={(keys) => setMailingCountry(Array.from(keys)[0] as string)}
                            >
                                {countryCodes.map((country) => (
                                    <SelectItem
                                        key={country.id}
                                        value={String(country.id)}
                                        startContent={<Image src={country.flag} alt={`${country.country} flag`} className="inline-block w-6 h-4 mr-2" />}
                                        textValue={`${country.country}`}
                                    >
                                        <div className="flex items-center">{`${country.country}`}</div>
                                    </SelectItem>
                                ))}
                            </Select>
                        )}
                        {loading ? (
                            <Skeleton className="w-full h-12 rounded" />
                        ) : (
                            <Select
                                selectionMode="single"
                                label="Address Type"
                                name="mailingAddressType"
                                className="mt-2"
                                placeholder="Select Address Type"
                                fullWidth
                                aria-label="Mailing Address Type"
                                selectedKeys={mailingAddressType ? [mailingAddressType] : undefined}
                                onSelectionChange={(event) => setMailingAddressType(Array.from(event)[0] as string)}
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

                    {/* Billing Address Section */}
                    <div>
                        <p className="text-base font-medium text-default-700">Billing Address</p>
                        <p className="mt-1 text-sm font-normal text-default-400">Please add an address for billing purposes.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        {loading ? (
                            <Skeleton className="w-full h-12 rounded" />
                        ) : (
                            <Input
                                name="billingAddress1"
                                className="mt-2"
                                placeholder="Address 1"
                                fullWidth
                                aria-label="Billing Address line 1"
                                value={billingAddress1}
                                onChange={(e) => setBillingAddress1(e.target.value)}
                            />
                        )}
                        {loading ? (
                            <Skeleton className="w-full h-12 rounded" />
                        ) : (
                            <Input
                                name="billingAddress2"
                                className="mt-2"
                                placeholder="Address 2 (Optional)"
                                fullWidth
                                aria-label="Billing Address line 2"
                                value={billingAddress2}
                                onChange={(e) => setBillingAddress2(e.target.value)}
                            />
                        )}
                    </div>

                    <Spacer y={2} />

                    <div style={{ display: 'flex', gap: '16px' }}>
                        {loading ? (
                            <Skeleton className="w-full h-12 rounded" />
                        ) : (
                            <Input
                                name="billingCity"
                                className="mt-2"
                                placeholder="City"
                                fullWidth
                                aria-label="Billing City"
                                value={billingCity}
                                onChange={(e) => setBillingCity(e.target.value)}
                            />
                        )}
                        {loading ? (
                            <Skeleton className="w-full h-12 rounded" />
                        ) : (
                            <Input
                                name="billingZipcode"
                                className="mt-2"
                                placeholder="Zipcode"
                                fullWidth
                                aria-label="Billing Zipcode"
                                value={billingZipcode}
                                onChange={(e) => setBillingZipcode(e.target.value)}
                            />
                        )}
                    </div>

                    <Spacer y={2} />

                    <div style={{ display: 'flex', gap: '16px' }}>
                        {loading ? (
                            <Skeleton className="w-full h-12 rounded" />
                        ) : (
                            <Select
                                selectionMode="single"
                                label="Country"
                                className="mt-2"
                                name="billingCountryId"
                                placeholder="Select a country"
                                fullWidth
                                selectedKeys={billingCountry ? [billingCountry] : undefined}
                                onSelectionChange={(keys) => setBillingCountry(Array.from(keys)[0] as string)}
                            >
                                {countryCodes.map((country) => (
                                    <SelectItem
                                        key={country.id}
                                        value={String(country.id)}
                                        startContent={<Image src={country.flag} alt={`${country.country} flag`} className="inline-block w-6 h-4 mr-2" />}
                                        textValue={`${country.country}`}
                                    >
                                        <div className="flex items-center">{`${country.country}`}</div>
                                    </SelectItem>
                                ))}
                            </Select>
                        )}
                        {loading ? (
                            <Skeleton className="w-full h-12 rounded" />
                        ) : (
                            <Select
                                selectionMode="single"
                                label="Address Type"
                                name="billingAddressType"
                                className="mt-2"
                                placeholder="Select Address Type"
                                fullWidth
                                aria-label="Billing Address Type"
                                selectedKeys={billingAddressType ? [billingAddressType] : undefined}
                                onSelectionChange={(event) => setBillingAddressType(Array.from(event)[0] as string)}
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
                            <Select
                                name='localeId'
                                className="mt-2"
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
                        <FormButton>Update Account</FormButton>

                    )}
                </form>
            </div>
        );
    }
);

AccountSetting.displayName = 'AccountSetting';

export default AccountSetting;

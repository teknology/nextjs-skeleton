'use client';

import { useState, useEffect, forwardRef, use } from 'react';
import { Button, Input, Select, SelectItem, Spacer, Divider, Skeleton, Image } from '@nextui-org/react';
import { cn } from '@/utils/cn';
import { useTranslations } from 'next-intl';
import * as actions from '@/actions';
import { Country } from '@/utils/types/types';

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

const stateOptions = [
    { label: 'California', value: 'CA' },
    { label: 'Texas', value: 'TX' },
    { label: 'New York', value: 'NY' },
    { label: 'Florida', value: 'FL' },
];

const addressTypeOptions = [
    { label: 'Residential', value: 'residential' },
    { label: 'Commercial', value: 'commercial' },
];

const AccountSetting = forwardRef<HTMLDivElement, AccountSettingCardProps>(
    ({ data, loading = false, className, ...props }, ref) => {
        const t = useTranslations('my_account.settings.profile');

        // Controlled input state
        const [address1, setAddress1] = useState(data?.address1 || '');
        const [address2, setAddress2] = useState(data?.address2 || '');
        const [city, setCity] = useState(data?.city || '');
        const [state, setState] = useState(data?.state || '');
        const [zipcode, setZipcode] = useState(data?.zipcode || '');
        const [addressType, setAddressType] = useState<string | undefined>(data?.addressType);

        const [stateCodes, setStateCodes] = useState<string[]>([]);

        const [countryCodes, setCountryCodes] = useState<Country[]>([]);
        const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

        // Fetch states on mount



        // Fetch countries on mount
        useEffect(() => {
            async function fetchCountries() {
                try {
                    const result = await actions.getCountries();
                    if (Array.isArray(result)) {
                        setCountryCodes(result);
                    } else {
                        console.error("Error fetching countries:", result.errors);
                    }
                } catch (error) {
                    console.error("Error fetching countries:", error);
                }
            }
            fetchCountries();
        }, []);

        useEffect(() => {
            async function fetchStates() {
                try {
                    const result = await actions.getStateProvince(data?.countryCodeId);
                    if (Array.isArray(result)) {
                        setStateCodes(result);
                    } else {
                        console.error("Error fetching states:", result);
                    }
                } catch (error) {
                    console.error("Error fetching states:", error);
                }
            }
            fetchStates();
        }, []);

        // Update the state when the data prop changes
        useEffect(() => {
            if (data) {
                setAddress1(data.address1 || '');
                setAddress2(data.address2 || '');
                setCity(data.city || '');
                setState(data.state || '');
                setZipcode(data.zipcode || '');
                setAddressType(data.addressType || undefined);
                if (data.countryCodeId) {
                    setSelectedCountry(String(data.countryCodeId));
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

                    {loading ? (
                        <Skeleton className="h-12 w-full rounded-lg" />
                    ) : (
                        <Select
                            name="state"
                            className="mt-2"
                            placeholder="Select State/Province"
                            fullWidth
                            aria-label="State or Province"
                            selectedKeys={state ? [state] : undefined}
                            onSelectionChange={(keys) => setState(Array.from(keys)[0] as string)}
                        >
                            {stateOptions.map((stateOption) => (
                                <SelectItem key={stateOption.value} value={stateOption.value}>
                                    {stateOption.label}
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
                            label="Country"
                            className='mt-2'
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
                                    <div className="flex items-center">
                                        {`${country.country}`}
                                    </div>
                                </SelectItem>
                            ))}
                        </Select>
                    )}

                    {/* Address Type Select */}
                    {loading ? (
                        <Skeleton className="h-12 w-full rounded-lg mt-2" />
                    ) : (
                        <Select
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
                        <Select className="mt-2" defaultSelectedKeys={['en']} aria-label="Preferred language">
                            {languageOptions.map((languageOption) => (
                                <SelectItem key={languageOption.value} value={languageOption.value}>
                                    {languageOption.label}
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

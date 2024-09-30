'use client';

import { useEffect, useState } from 'react';
import { Select, SelectItem, Image, SharedSelection } from '@nextui-org/react';
import { Locale } from '@/utils/types/types';
import * as actions from '@/actions';
import { useSession } from 'next-auth/react';
import { auth } from '@/auth';



export default function MiniLanguageSwitcher() {
    const [selectedLocale, setSelectedLocale] = useState<string | null>(null);
    const [localeCodes, setLocaleCodes] = useState<Locale[]>([]);

    const { data: session } = useSession()

    console.log("switchercomponent:", session?.user)

    // Fetch countries on mount
    useEffect(() => {
        async function fetchEnabledLocales() {
            try {
                const result = await actions.getEnabledLocales();

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

        console.log("switcher", selectedLocale)

        fetchEnabledLocales()


    }, []);

    useEffect(() => {
        async function fetchUserLocale() {
            const userLocale = await actions.getLocaleByUser();
            if (localeCodes.length > 0 && userLocale) {
                setSelectedLocale(String(userLocale));
            }
        }

        fetchUserLocale();
    }, [localeCodes]);



    const handleLanguageChange = (keys: SharedSelection) => {
        const selectedId = parseInt(keys.currentKey || '', 10);
        setSelectedLocale(Array.from(keys)[0] as string);
    };

    return (
        <div className="flex items-center mx-5"> {/* Add mx-2 to add space between logo and language switcher */}
            <small>Language:</small>
            <Select
                selectionMode="single"
                variant='underlined'
                aria-label="Preferred language"
                selectedKeys={selectedLocale ? [selectedLocale] : undefined}
                onSelectionChange={handleLanguageChange}
                className="bg-transparent border-none text-inherit p-0 min-w-[120px] focus:ring-0"  // Transparent select
            >
                {localeCodes.map((locale) => (
                    <SelectItem
                        key={locale.id}
                        value={locale.code}
                    >
                        {locale.language}
                    </SelectItem>
                ))}
            </Select>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { Select, SelectItem, Image, SharedSelection } from '@nextui-org/react';
import { Locale } from '@/utils/types/types';
import * as actions from '@/actions';


const languageOptions = [
    {
        id: 38,
        code: 'en',
        country: 'United States',
        language: 'English',
        flag: 'https://flagcdn.com/w320/us.png',
    },
    {
        id: 39,
        code: 'es',
        country: 'Spain',
        language: 'Spanish',
        flag: 'https://flagcdn.com/w320/es.png',
    },
    {
        id: 40,
        code: 'fr',
        country: 'France',
        language: 'French',
        flag: 'https://flagcdn.com/w320/fr.png',
    },
];

export default function MiniLanguageSwitcher() {
    const [selectedLocale, setSelectedLocale] = useState<string | null>(null);
    const [localeCodes, setLocaleCodes] = useState<Locale[]>([]);

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
                    <SelectItem key={locale.id} value={locale.code}>
                        {locale.language}
                    </SelectItem>
                ))}
            </Select>
        </div>
    );
}

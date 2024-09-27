'use client';

import Image from 'next/image';
import * as actions from '@/actions';
import { useState, useEffect } from 'react';
import { Button, Input } from '@nextui-org/react';
import FormButton from '@/app/components/common/form-button';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes'
import { getTranslations } from 'next-intl/server';
import LanguageSwitcher from '@/app/components/common/language-switcher';
import { useTranslations } from 'next-intl';





export default function Test() {
  const { data: session, status, update } = useSession();
  const [result, setResult] = useState<any | null>(null); // State to manage fetched data
  const [loading, setLoading] = useState(true); // State to manage loading
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [appearance, setAppearance] = useState<{ id: number; theme: string | null; userId: string; } | null>(null);
  const t = useTranslations('my_account');


  useEffect(() => {
    async function fetchData() {
      try {

        // const appearance = await actions.getAppearanceSettings();
        //  setAppearance(appearance);
        const userResult = await actions.getAccountSettings(); // Fetch user data
        //  console.log(await getUserTheme('cm0hgubny0000hc3dnm0xycpj'))
        setResult(userResult); // Update state with fetched 
        console.log('resuts:testpage', userResult)
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setResult(null); // Set result to null if there's an error
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }

    }

    fetchData();
  }, []);


  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }
  return (
    <div className="container mx-auto space-y-1">
      <LanguageSwitcher />

      <Button>Update image</Button>
      <Button onClick={() => update()}>Edit name</Button>

      <pre>{loading ? 'Loading...' : JSON.stringify(result)}</pre> {/* Pretty-print the result */}

      <div>
        <h1>{t('main_navigation.signed_in_as')}</h1>
        <p>The user image is {session?.user?.image}</p>
      </div>
      <pre>
        Appearance
        {loading ? 'Loading...' : JSON.stringify(appearance, null, 2)}
      </pre>
      <div>
        <div>
          The current theme is: {theme}
          <select value={theme} onChange={e => setTheme(e.target.value)}>
            <option value="system">System</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
      </div>
      <div className="flex justify-center w-100 py-100">
        <form>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            className="p-5"
          />
          <Input
            className="p-5"
            type="password"
            name="password"
            placeholder="Password"
          />
          <Input
            className="p-5"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
          />

          <FormButton> Submit </FormButton>
        </form>
      </div>
    </div>
  );
}

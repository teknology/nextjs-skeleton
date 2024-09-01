'use client';

import Image from 'next/image';
import * as actions from '@/actions';
import { useState, useEffect } from 'react';
import { Button, Input } from '@nextui-org/react';
import FormButton from '@/app/components/common/form-button';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes'
import { getUserTheme } from '@/db/queries/theme';


export default function Home() {
  const { data: session, status, update } = useSession();
  const [result, setResult] = useState(null); // State to store the result
  const [loading, setLoading] = useState(true); // State to manage loading
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)


  useEffect(() => {
    async function fetchData() {
      try {
        const userResult = await actions.findUserByEmail('gary@magehd.com');
        //  console.log(await getUserTheme('cm0hgubny0000hc3dnm0xycpj'))
        // setResult(userResult); // Update state with fetched result
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
      <Button>Update image</Button>
      <Button onClick={() => update()}>Edit name</Button>

      <pre>{loading ? 'Loading...' : JSON.stringify(session?.user)}</pre> {/* Pretty-print the result */}

      <div>
        <p>The user image is {session?.user?.image}</p>
      </div>
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

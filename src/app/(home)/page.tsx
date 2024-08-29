'use client';

import Image from 'next/image';
import * as actions from '@/actions';
import { useState, useEffect } from 'react';
import { Button, Input } from '@nextui-org/react';
import FormButton from '@/app/components/common/form-button';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status, update } = useSession();
  const [result, setResult] = useState(null); // State to store the result
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    async function fetchData() {
      try {
        const userResult = await actions.findUserByEmail('gary@magehd.com');
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

  return (
    <div className="container mx-auto space-y-1">
      <Button>Update image</Button>
      <Button onClick={() => update()}>Edit name</Button>

      <pre>{loading ? 'Loading...' : JSON.stringify(result, null, 2)}</pre> {/* Pretty-print the result */}

      <div>
        <p>The user image is {session?.user?.image}</p>
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

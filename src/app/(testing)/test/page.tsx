'use client';

import Image from 'next/image';
import * as actions from '@/actions';
import { Button, Input } from '@nextui-org/react';
import FormButton from '@/app/components/common/form-button';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes'
import { auth } from '@/auth';
import { headers } from 'next/headers';




export default function Test() {

  return (
    <div className="container mx-auto space-y-1">


      <div>
        <h1>'title'</h1>
        <p></p>
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import * as actions from '@/actions';
import { Button, Input } from '@nextui-org/react';
import FormButton from '@/app/components/common/form-button';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes'
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { auth } from '@/auth';
import { headers } from 'next/headers';




export default function Test() {

  const t = useTranslations('home_page');











  return (
    <div className="container mx-auto space-y-1">


      <div>
        <h1>{t('title')}</h1>
        <p></p>
      </div>
    </div>
  );
}

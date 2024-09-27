'use client';

import { SessionProvider } from 'next-auth/react';
import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import { NextIntlClientProvider } from 'next-intl';

interface ProvidersProps {
  children: React.ReactNode;
  session?: any;
  messages: any; // Messages should be passed from the parent
  locale: string;
}

export default function Providers({ children, session, messages, locale }: ProvidersProps) {
  const router = useRouter();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <SessionProvider session={session}>
        <ThemeProvider>
          <NextUIProvider navigate={router.push}>
            {children}
          </NextUIProvider>
        </ThemeProvider>
      </SessionProvider>
    </NextIntlClientProvider>
  );
}

'use client'

import { SessionProvider } from 'next-auth/react'
import { NextUIProvider } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { ThemeProvider } from 'next-themes'

interface ProvidersProps {
  children: React.ReactNode,
  session?: any,
}

export default function Providers({ children, session }: ProvidersProps) {
  const router = useRouter();

  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <NextUIProvider navigate={router.push}>
          {children}
        </NextUIProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}

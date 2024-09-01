'use client'

import { SessionProvider } from 'next-auth/react'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from 'next-themes'

interface ProvidersProps {
  children: React.ReactNode,
  session?: any,
}

export default function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}

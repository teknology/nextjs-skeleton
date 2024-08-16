'use client'

import { SessionProvider } from 'next-auth/react'
import { NextUIProvider } from '@nextui-org/react'
interface ProvidersProps {
  children: React.ReactNode,
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </SessionProvider>
  )
}

'use client'

import { SessionProvider } from 'next-auth/react'
import { NextUIProvider } from '@nextui-org/react'
interface ProvidersProps {
  children: React.ReactNode,
  session: any
}

export default function Providers({ session, children }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <NextUIProvider>{children}</NextUIProvider>
    </SessionProvider>
  )
}

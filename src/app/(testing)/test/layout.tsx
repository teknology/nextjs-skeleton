import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import Providers from '@/app/providers'
import { getLocale, getMessages } from 'next-intl/server'



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}


export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <Providers messages={messages} locale={locale}>{children}</Providers>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Fraunces, Geist, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  style: ['italic', 'normal'],
  weight: ['300', '400', '500'],
  display: 'swap',
})

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ana_dan v2.7.3-beta — profilo ufficiale',
  description:
    'ana_bot · señorita edition · UI/UX class · girasole_core enabled · modalità beta perenne',
  openGraph: {
    title: 'ana_dan v2.7.3-beta — profilo ufficiale',
    description:
      'Profilo ufficiale ana_bot señorita_pro_max. Status: ONLINE, in costante aggiornamento. 🌻',
    type: 'website',
    url: 'https://creailtuobot.com',
    siteName: 'creailtuobot',
  },
  icons: {
    icon: '/favicon.svg',
  },
  metadataBase: new URL('https://creailtuobot.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="it"
      className={`${fraunces.variable} ${geistSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}

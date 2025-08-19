// Update the main layout to include proper font loading and custom cursor
import React from 'react'
import Header from '@/app/components/Header'
import MiniPlayer from '@/app/components/MiniPlayer'
import { PlayerProvider } from '@/app/components/PlayerProvider'
import Footer from '@/app/components/Footer'
import DonateBanner from '@/app/components/DonateBanner'
import '@/app/globals.css'
import type { Metadata } from 'next'
import { DM_Sans, Inter, IBM_Plex_Mono } from 'next/font/google'

// Initialize fonts
const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['400', '500', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Afropop Worldwide',
  description: 'Audio-first storytelling from Afropop Worldwide',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${dmSans.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const s = localStorage.getItem('theme'); const sys = window.matchMedia('(prefers-color-scheme: dark)').matches; const t = s || 'system'; const dark = t === 'dark' || (t === 'system' && sys); const r = document.documentElement; r.classList[dark ? 'add' : 'remove']('dark'); r.setAttribute('data-theme', dark ? 'dark' : 'light'); } catch (e) {} })();`,
          }}
        />
      </head>
      <body className={inter.className}>
        <PlayerProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
              <DonateBanner />
            </main>
            <Footer />
            <MiniPlayer />
          </div>
        </PlayerProvider>
      </body>
    </html>
  )
}

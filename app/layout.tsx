// Update the main layout to include proper font loading and custom cursor
import React from 'react'
import Header from '@/app/components/Header'
import MiniPlayer from '@/app/components/MiniPlayer'
import { PlayerProvider } from '@/app/components/PlayerProvider'
import Footer from '@/app/components/Footer'
import DonateBanner from '@/app/components/DonateBanner'
import SentryInit from '@/app/components/SentryInit'
import '@/app/globals.css'
import type { Metadata } from 'next'
import { Outfit, Archivo, IBM_Plex_Mono, Anton } from 'next/font/google'

// Initialize fonts - distinctive choices for cultural context
const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700', '800'],
})

const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-archivo',
  weight: ['400', '500', '600', '700'],
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500', '600', '700'],
})

const displayCondensed = Anton({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display-condensed',
  weight: '400',
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
    <html lang="en" suppressHydrationWarning className={`dark ${outfit.variable} ${archivo.variable} ${ibmPlexMono.variable} ${displayCondensed.variable}`}>
      <head>
        <SentryInit />
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const ls = localStorage; const r = document.documentElement; r.classList.add('dark'); r.setAttribute('data-theme', 'dark'); const palette = (ls.getItem('palette') || 'spring'); const palettes = ['spring','summer','autumn','winter']; palettes.forEach(p => r.classList.remove('theme-' + p)); r.classList.add('theme-' + palette); r.setAttribute('data-palette', palette); } catch (e) {} })();`,
          }}
        />
      </head>
      <body className={`app-canvas ${outfit.className}`}>
        <PlayerProvider>
          <Header />
          <main>
            {children}
            <DonateBanner />
          </main>
          <Footer />
          <MiniPlayer />
        </PlayerProvider>
      </body>
    </html>
  )
}

// Update the main layout to include proper font loading and custom cursor
import React from 'react'
import Header from '@/app/components/Header'
import MiniPlayer from '@/app/components/MiniPlayer'
import Footer from '@/app/components/Footer'
import DonateBanner from '@/app/components/DonateBanner'
import CustomCursor from '@/app/components/CustomCursor'
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
    <html lang="en" className={`${dmSans.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <body className={inter.className}>
        <CustomCursor />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
            <DonateBanner />
          </main>
          <Footer />
          <MiniPlayer />
        </div>
      </body>
    </html>
  )
}
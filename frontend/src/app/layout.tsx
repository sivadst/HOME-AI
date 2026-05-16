import type { Metadata, Viewport } from 'next'
import { Syne, Space_Mono } from 'next/font/google'
import './globals.css'
import { RootProviders } from '@/components/core/RootProviders'
import { ParticleCanvas } from '@/components/visualization/ParticleCanvas'
import { GridOverlay } from '@/components/layout/GridOverlay'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HOME.AI — The Intelligence That Runs Tomorrow',
  description: 'Hyper-Operational Meta Engine Artificial Intelligence — planetary-scale AI operating system',
  keywords: ['AI', 'intelligence', 'autonomous', 'planetary', 'enterprise'],
  authors: [{ name: 'HOME.AI Systems' }],
  openGraph: {
    title: 'HOME.AI',
    description: 'The Intelligence That Runs Tomorrow.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#020408',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceMono.variable} dark`}>
      <body className="bg-void text-white overflow-hidden">
        <RootProviders>
          <ParticleCanvas />
          <GridOverlay />
          {children}
        </RootProviders>
      </body>
    </html>
  )
}

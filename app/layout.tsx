import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Property Sales Assistant | 24/7 Lead Generation',
  description: 'Capture leads even while you sleep. Auto-qualify buyers, suggest properties instantly, and forward leads to WhatsApp in 1 second.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}


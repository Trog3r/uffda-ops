import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Uffda Ops',
  description: 'Internal operations dashboard',
  icons: {
    icon: [
      { url: '/brand/favicon.svg', type: 'image/svg+xml' },
      { url: '/brand/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/brand/favicon.ico',
    apple: { url: '/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${manrope.variable}`}>
      <body className="h-full">{children}</body>
    </html>
  )
}

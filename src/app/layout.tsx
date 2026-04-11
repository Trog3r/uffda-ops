import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Uffda Ops',
  description: 'Internal operations dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  )
}

'use client'

import React from 'react';
import { Ubuntu } from 'next/font/google'
import './globals.css'

const ubuntu = Ubuntu({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={ubuntu.className}>
      <body>
        {children}
      </body>
    </html>
  )
}

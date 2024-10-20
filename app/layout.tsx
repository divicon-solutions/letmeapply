'use client'

import React from 'react';
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Ubuntu } from 'next/font/google'
import './globals.css'
import SideNav from '../components/SideNav'
import { CheckUser } from '@/utils/check-user';
import { FeedbackFish } from '@feedback-fish/react';

const ubuntu = Ubuntu({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

// export const metadata = {
//   title: 'Let Me Apply',
//   description: 'Let Me Apply is a platform that helps you find your dream job.',
// }

export default function RootLayout({ children }: { children: React.ReactNode }) {


  return (
    <ClerkProvider>
      <html lang="en" className={ubuntu.className}>
        <body>
          <div className="flex h-screen overflow-hidden">
            <SideNav />
            <div className="flex-1 flex flex-col overflow-hidden">
              <header className="bg-gray-800 text-white z-10">
                <nav className="container mx-auto px-4 py-2 flex justify-between items-center">
                  <div className="text-xl font-bold">Let Me Apply</div>
                  <div className="flex items-center space-x-4">
                    <FeedbackFish projectId="646bcbf1aa420d">
                      <span className="cursor-pointer hover:text-blue-300">
                        Send Feedback
                      </span>
                    </FeedbackFish>
                    <SignedOut>
                      <SignInButton>
                        <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
                          Sign In
                        </button>
                      </SignInButton>
                    </SignedOut>
                    <SignedIn>
                      <UserButton afterSignOutUrl="/" />
                      <CheckUser />
                    </SignedIn>
                  </div>
                </nav>
              </header>
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                <div className="container mx-auto px-4 py-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}

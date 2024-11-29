'use client';

import { ReactNode, useState } from 'react';
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { FeedbackFish } from '@feedback-fish/react';
import SideNav from './SideNav';
import { CheckUser } from '@/utils/check-user';
import '../app/globals.css';

interface NavWrapperProps {
  children: ReactNode;
}

const NavWrapper = ({ children }: NavWrapperProps) => {
  const { user } = useUser();
  const [isNavOpen, setIsNavOpen] = useState(true);

  return (
    <div className="min-h-screen">
      {/* Top Navigation - Fixed */}
      <header className="fixed top-0 right-0 left-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white z-50 border-b border-gray-700">
        <nav className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left section */}
            <div className="flex items-center space-x-8">
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="text-2xl font-bold tracking-tight">
                <span className="text-white">LetMe</span>
                <span className="text-blue-400">Apply</span>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-6">
              <FeedbackFish projectId="646bcbf1aa420d" userId={user?.emailAddresses[0].emailAddress}>
                <button className="text-gray-300 hover:text-white transition-colors duration-200">
                  Send Feedback
                </button>
              </FeedbackFish>

              <SignedOut>
                <SignInButton>
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors duration-200 font-medium">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 rounded-lg"
                    }
                  }}
                />
                <CheckUser />
              </SignedIn>
            </div>
          </div>
        </nav>
      </header>

      {/* Side Navigation */}
      <SideNav isOpen={isNavOpen} />

      {/* Main Content - With proper padding and margin */}
      <div className={`pt-16 ${isNavOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
        <main className="bg-gray-100 min-h-screen">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NavWrapper;

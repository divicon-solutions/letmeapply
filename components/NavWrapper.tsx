'use client';

import { ReactNode, useState } from 'react';
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { FeedbackFish } from '@feedback-fish/react';
import SideNav from './SideNav';
import { CheckUser } from '@/utils/check-user';
import '../app/globals.css';

// SVG icons as components
const ProfileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor" />
  </svg>
);

const JobsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2.01 6.89 2.01 8L2 19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4Z" fill="currentColor" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" fill="currentColor" />
  </svg>
);

interface NavWrapperProps {
  children: ReactNode;
}

const NavWrapper = ({ children }: NavWrapperProps) => {
  const { user } = useUser();
  const [isNavOpen, setIsNavOpen] = useState(true);

  return (
    <div className="min-h-screen">
      {/* Top Navigation - Fixed */}
      <header className="fixed top-0 right-0 left-0 bg-white text-gray-900 z-50 border-b border-gray-200">
        <nav className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left section */}
            <div className="flex items-center space-x-8">
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="p-2 hover:bg-[rgb(230,244,229)] rounded-lg transition-colors duration-200"
              >
                <svg className="w-6 h-6 hover:text-[#15ae5c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div style={{ display: "flex", alignItems: "center", fontFamily: "Consolas", fontSize: "22px", fontWeight: "bold" }}>
                <h2 style={{ margin: 0 }}>LetMe </h2>
                <h2 style={{ margin: 0, backgroundColor: "#15ae5c", color: "white", borderRadius: "4px", padding: "0px 4px", marginLeft: "2px" }}>Apply</h2>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-6">
              <FeedbackFish projectId="646bcbf1aa420d" userId={user?.emailAddresses[0].emailAddress}>
                <button className="text-gray-600 hover:text-[#15ae5c] hover:bg-[rgb(230,244,229)] px-3 py-2 rounded-lg transition-colors duration-200">
                  Send Feedback
                </button>
              </FeedbackFish>

              <SignedOut>
                <SignInButton>
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-white">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <UserButton
                  afterSignOutUrl="/signin"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 rounded-lg"
                    }
                  }}
                >
                </UserButton>
                <CheckUser />
              </SignedIn>
            </div>
          </div>
        </nav>
      </header>

      {/* Side Navigation */}
      <SideNav isOpen={isNavOpen} />

      {/* Main Content */}
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

'use client';

import { useState } from 'react';
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import { FeedbackFish } from '@feedback-fish/react';
import { Outlet } from 'react-router-dom';
import SideNav from './SideNav';
import { CheckUser } from '../utils/check-user';
import '../globals.css';

const NavWrapper = () => {
  const { user } = useUser();
  const [isNavOpen, setIsNavOpen] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation - Fixed */}
      <header className="fixed top-0 right-0 left-0 bg-white shadow-sm z-50">
        <nav className="h-16 px-4">
          <div className="flex items-center justify-between h-full">
            {/* Left section */}
            <div className="flex items-center gap-6">
              <SignedIn>
                <button
                  onClick={() => setIsNavOpen(!isNavOpen)}
                  className="p-2 hover:bg-[rgb(230,244,229)] rounded-lg transition-colors duration-200 -ml-2"
                >
                  <svg className="w-6 h-6 hover:text-[#15ae5c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </SignedIn>
              <div style={{ display: "flex", alignItems: "center", fontFamily: "Consolas", fontSize: "22px", fontWeight: "bold" }}>
                <h2 style={{ margin: 0 }}>LetMe </h2>
                <h2 style={{ margin: 0, backgroundColor: "#15ae5c", color: "white", borderRadius: "4px", padding: "0px 4px", marginLeft: "2px" }}>Apply</h2>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4">
              <FeedbackFish projectId="646bcbf1aa420d" userId={user?.emailAddresses[0].emailAddress}>
                <button className="text-gray-600 hover:text-[#15ae5c] hover:bg-[rgb(230,244,229)] px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium">
                  Send Feedback
                </button>
              </FeedbackFish>

              <SignedOut>
                <SignInButton>
                  <button className="bg-[#15ae5c] hover:bg-[#128a4a] px-5 py-2 rounded-lg transition-colors duration-200 font-medium text-white text-sm">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                  <UserButton
                    afterSignOutUrl="/signin"
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 rounded-lg"
                      }
                    }}
                  />
                  <CheckUser />
                </div>
              </SignedIn>
            </div>
          </div>
        </nav>
      </header>

      {/* Side Navigation - Only show when signed in */}
      <SignedIn>
        <SideNav isOpen={isNavOpen} />
      </SignedIn>

      {/* Main Content */}
      <div className={`pt-16 ${user && isNavOpen ? 'lg:pl-64' : 'pl-0'} transition-all duration-300`}>
        <main className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default NavWrapper;

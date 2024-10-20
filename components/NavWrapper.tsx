import { ReactNode } from 'react';
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { FeedbackFish } from '@feedback-fish/react';
import SideNav from './SideNav';
import { CheckUser } from '@/utils/check-user';
import '../app/globals.css'

interface NavWrapperProps {
  children: ReactNode;
}

const NavWrapper = ({ children }: NavWrapperProps) => {
  const { user } = useUser();

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-800 text-white z-10">
          <nav className="container mx-auto px-4 py-2 flex justify-between items-center">
            <div className="text-xl font-bold">Let Me Apply</div>
            <div className="flex items-center space-x-4">
              <FeedbackFish projectId="646bcbf1aa420d" userId={user?.emailAddresses[0].emailAddress}>
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
  );
};

export default NavWrapper;

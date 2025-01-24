'use client';

import { Link, useLocation } from 'react-router-dom';
import { SignedIn } from '@clerk/clerk-react';

interface SideNavProps {
  isOpen: boolean;
}

const SideNav = ({ isOpen }: SideNavProps) => {
  const location = useLocation();

  const navItems = [
    { path: '/profile', label: 'Profile', icon: ProfileIcon },
  ];

  return (
    <SignedIn>
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 ${isOpen ? 'w-64' : 'w-0'
          } pt-16`}
      >
        <nav className="h-full">
          <ul className="py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-6 py-3 text-gray-700 hover:bg-[rgb(230,244,229)] hover:text-[#15ae5c] transition-colors duration-200 ${location.pathname === item.path ? 'bg-[rgb(230,244,229)] text-[#15ae5c]' : ''
                      }`}
                  >
                    <Icon />
                    <span className="ml-4">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </SignedIn>
  );
};

// Icon components
const JobsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2.01 6.89 2.01 8L2 19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4Z" fill="currentColor" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor" />
  </svg>
);

export default SideNav;

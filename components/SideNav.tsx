'use client';

import Link from 'next/link';
import { FaBriefcase, FaUser } from 'react-icons/fa';
import { useAuth } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

interface SideNavProps {
  isOpen: boolean;
}

const SideNav = ({ isOpen }: SideNavProps) => {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();

  const navItems = isSignedIn ? navAuthenticatedItems : navUnauthenticatedItems;

  return (
    <nav
      className={`
        fixed top-0 left-0 h-screen w-64 pt-16
        bg-white
        text-gray-900 shadow-lg z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Navigation Links */}
      <div className="px-4 py-6">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                ${pathname === item.path ? 'bg-[rgb(230,244,229)] text-[#15ae5c]' : 'text-gray-600 hover:text-[#15ae5c]'}
                hover:bg-[rgb(230,244,229)]
                transition-all duration-200
                group
              `}
            >
              <span className={`
                text-gray-400 group-hover:text-[#15ae5c] transition-colors
                ${pathname === item.path ? 'text-[#15ae5c]' : ''}
              `}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

const navAuthenticatedItems = [
  // {
  //   label: 'Jobs',
  //   path: '/jobs',
  //   icon: <FaBriefcase className="w-5 h-5" />,
  // },
  // {
  //   label: 'Resume Match',
  //   path: '/resume-job-match',
  //   icon: <FaFileAlt className="w-5 h-5" />,
  // },
  // {
  //   label: 'AI Cover Letter',
  //   path: '/ai-cover-letter',
  //   icon: <FaEnvelopeOpenText className="w-5 h-5" />,
  // },
  {
    label: 'Profile',
    path: '/profile',
    icon: <FaUser className="w-5 h-5" />,
  }
];

const navUnauthenticatedItems = [
  {
    label: 'Jobs',
    path: '/jobs',
    icon: <FaBriefcase className="w-5 h-5" />,
  },
];

export default SideNav;

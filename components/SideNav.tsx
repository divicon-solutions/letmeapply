'use client';

import Link from 'next/link';
import { FaBriefcase, FaClipboard, FaFileAlt, FaChartLine, FaEnvelopeOpenText, FaFileArchive } from 'react-icons/fa';

interface SideNavProps {
  isOpen: boolean;
}

const SideNav = ({ isOpen }: SideNavProps) => {
  return (
    <nav
      className={`
        fixed top-0 left-0 h-screen w-64 pt-16
        bg-gradient-to-b from-gray-900 to-gray-800
        text-white shadow-xl z-40
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
                text-gray-300 hover:text-white
                hover:bg-gray-700/50
                transition-all duration-200
                group
              `}
            >
              <span className="text-gray-400 group-hover:text-blue-400 transition-colors">
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Section - Pro Badge */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-800">
          {/* <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <FaChartLine className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Pro Account</p>
            <p className="text-xs text-gray-400">Advanced Features</p>
          </div> */}
        </div>
      </div>
    </nav>
  );
};

const navItems = [
  {
    label: 'Jobs',
    path: '/jobs',
    icon: <FaBriefcase className="w-5 h-5" />,
  },
  {
    label: 'Resume Match',
    path: '/resume-job-match',
    icon: <FaFileAlt className="w-5 h-5" />,
  },
  {
    label: 'AI Cover Letter',
    path: '/ai-cover-letter',
    icon: <FaEnvelopeOpenText className="w-5 h-5" />,
  }
];

export default SideNav;

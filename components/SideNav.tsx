'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaBriefcase, FaClipboard, FaBars, FaTimes, FaFileAlt } from 'react-icons/fa';

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Toggle button */}
      <button
        className="fixed top-4 left-4 z-30 p-2 bg-blue-600 text-white rounded-md lg:hidden"
        onClick={toggleNav}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Side navigation */}
      <nav className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out z-20 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-screen`}>
        <div className="p-4 mt-16 lg:mt-0">
          <ul className="space-y-2">
            <li>
              <Link href="/jobs" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaBriefcase className="mr-2" />
                Jobs
              </Link>
            </li>
            <li>
              <Link href="/board" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaClipboard className="mr-2" />
                Board
              </Link>
            </li>
            <li>
              <Link href="/resume-job-match" className="flex items-center p-2 hover:bg-gray-700 rounded">
                <FaFileAlt className="mr-2" />
                Resume/Job Match
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden"
          onClick={toggleNav}
        ></div>
      )}
    </>
  );
};

export default SideNav;

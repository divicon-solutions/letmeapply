import { Navigate, RouteObject } from 'react-router-dom';
import { SignedIn } from '@clerk/clerk-react';
import NavWrapper from './components/NavWrapper';
import ProfilePage from './pages/ProfilePage';
import SignInPage from './pages/SignInPage';
import ResumeDownloadPage from './pages/ResumeDownloadPage';
import CoverLetterPage from './pages/CoverLetterPage';
import JobTrackerPage from './pages/JobTrackerPage';
import LandingPage from './pages/LandingPage';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <NavWrapper />,
        children: [
            {
                path: '/',
                element: <LandingPage />,
            },
            {
                path: '/profile',
                element: <SignedIn><ProfilePage /></SignedIn>,
            },
            {
                path: '/resume-download/:resume_id',
                element: <SignedIn><ResumeDownloadPage /></SignedIn>,
            },
            {
                path: '/cover-letter',
                element: <SignedIn><CoverLetterPage /></SignedIn>,
            },
            {
                path: '/job-tracker',
                element: <SignedIn><JobTrackerPage /></SignedIn>,
            }
        ],
    },
    {
        path: '/signin',
        element: <SignInPage />,
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]; 
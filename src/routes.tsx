import { Navigate, RouteObject } from 'react-router-dom';
import { SignedIn } from '@clerk/clerk-react';
import NavWrapper from './components/NavWrapper';
import ProfilePage from './pages/ProfilePage';
import SignInPage from './pages/SignInPage';
import ResumeDownloadPage from './pages/ResumeDownloadPage';
import CoverLetterPage from './pages/CoverLetterPage';
import JobTrackerPage from './pages/JobTrackerPage';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';

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
                element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
            },
            {
                path: '/resume-download/:resume_id',
                element: <ProtectedRoute><ResumeDownloadPage /></ProtectedRoute>,
            },
            {
                path: '/cover-letter',
                element: <ProtectedRoute><CoverLetterPage /></ProtectedRoute>,
            },
            {
                path: '/job-tracker',
                element: <ProtectedRoute><JobTrackerPage /></ProtectedRoute>,
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
import { Navigate, RouteObject } from 'react-router-dom';
import NavWrapper from './components/NavWrapper';
import ProfilePage from './pages/ProfilePage';
import SignInPage from './pages/SignInPage';
import ResumeDownloadPage from './pages/ResumeDownloadPage';
import CoverLetterPage from './pages/CoverLetterPage';
import JobTrackerPage from './pages/JobTrackerPage';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <NavWrapper />,
        children: [
            {
                path: '/',
                element: <ProfilePage />,
            },
            {
                path: '/profile',
                element: <ProfilePage />,
            },
            {
                path: '/resume-download/:resume_id',
                element: <ResumeDownloadPage />,
            },
            {
                path: '/cover-letter',
                element: <CoverLetterPage />,
            },
            {
                path: '/job-tracker',
                element: <JobTrackerPage />,
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
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { routes } from './routes';

// Initialize QueryClient
const queryClient = new QueryClient();

// Get Clerk publishable key from environment variable
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AppRoutes() {
  return useRoutes(routes);
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppRoutes />
          <Toaster position="bottom-right" />
        </Router>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;

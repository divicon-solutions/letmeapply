import React from 'react';
import JobBoard from '@/components/JobBoard';
import NavWrapper from '@/components/NavWrapper';
import { ClerkProvider } from '@clerk/nextjs';

const JobsPage = () => {
  return (
    <ClerkProvider>
      <NavWrapper>
        <JobBoard />
      </NavWrapper>
    </ClerkProvider>
  );
};

export default JobsPage;

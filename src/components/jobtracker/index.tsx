import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_API_URL } from '@/utils/config';
import { useAuth } from '@clerk/clerk-react';
import { useState, useCallback } from 'react';
import { JobData, JobStatus } from './constants';
import StatusTabs from './StatusTabs';
import SearchBar from './SearchBar';
import JobTable from './JobTable';

const JobTracker = () => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [activeStatus, setActiveStatus] = useState<JobStatus>('APPLIED');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');

  const { data: jobs = [], isLoading, error: fetchError } = useQuery<JobData[]>({
    queryKey: ['jobs', activeStatus, currentSearch],
    queryFn: async () => {
      try {
        const token = await getToken();
        console.log('Fetching jobs with token:', token);

        const response = await axios.get(`${BASE_API_URL}/api/v1/job-tracker`, {
          params: {
            status: activeStatus,
            ...(currentSearch && { search: currentSearch }),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Jobs API Response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching jobs:', error);
        if (axios.isAxiosError(error)) {
          console.error('API Error Response:', error.response?.data);
          console.error('API Error Status:', error.response?.status);
        }
        throw error;
      }
    },
  });

  const updateJobStatus = useMutation({
    mutationFn: async ({
      extractionId,
      status,
    }: {
      extractionId: number;
      status: JobStatus;
    }) => {
      const token = await getToken();
      console.log('Updating status with payload:', { extractionId, status });

      const response = await axios.post(`${BASE_API_URL}/api/v1/job-tracker`, {
        extraction_id: extractionId,
        status,
        is_favorite: false,
        notes: '',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Status Update Response:', response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobStatusCounts'] });
      toast.success('Job status updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update job status');
      console.error('Error updating job status:', error);
    },
  });

  const { data: statusCounts = {}, isLoading: isStatusCountsLoading } = useQuery({
    queryKey: ['jobStatusCounts'],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get(`${BASE_API_URL}/api/v1/job-tracker/status-counts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });

  const handleStatusChange = useCallback((status: JobStatus) => {
    setActiveStatus(status);
    setSearchQuery('');
    setCurrentSearch('');
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setCurrentSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleStatusUpdate = useCallback((extractionId: number, status: JobStatus) => {
    updateJobStatus.mutate({ extractionId, status });
  }, [updateJobStatus]);

  if (fetchError) {
    return <div className="p-4 text-red-500 bg-white/80 backdrop-blur-sm rounded-lg">Error loading jobs</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="container mx-auto px-4 py-8">
        <StatusTabs
          activeStatus={activeStatus}
          onStatusChange={handleStatusChange}
          statusCounts={statusCounts}
        />
      </div>
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
      />
      <JobTable
        jobs={jobs}
        isLoading={isLoading}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default JobTracker;

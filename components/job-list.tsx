'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Job } from '../types/job';
import ApplyDrawer from './ApplyDrawer';
import JobDetails from './JobDetails';

dayjs.extend(relativeTime);

const JobList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('All');
  const [searchText, setSearchText] = useState<string>('');
  const [jobType, setJobType] = useState<string>('full-time');
  const [location, setLocation] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerKey, setDrawerKey] = useState<number>(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchJobs = useCallback(async (resetPage: boolean = false) => {
    if (loading || !hasMore) return;

    setLoading(true);
    const currentPage = resetPage ? 1 : page;
    const queryParams = new URLSearchParams({
      page: currentPage.toString(),
      pageSize: pageSize.toString(),
      searchText,
      jobType,
      location,
      datePosted: dateFilter !== 'All' ? dateFilter : '',
      currentJobIds: jobs.map(job => job.external_job_id).join(','),
    });

    try {
      const response = await fetch(`/api/job?${queryParams.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setJobs(prevJobs => resetPage ? data.data : [...prevJobs, ...data.data]);
        setHasMore(data.hasMore);
        setPage(currentPage + 1);
      } else {
        console.error('Failed to fetch jobs:', data.error);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchText, jobType, location, dateFilter, jobs, hasMore]);

  const lastJobElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchJobs();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchJobs]
  );

  const handleSearch = () => {
    setJobs([]);
    setPage(1);
    setHasMore(true);
    fetchJobs(true);
  };

  const handleApplyClick = useCallback(() => {
    setIsDrawerOpen(true);
    setDrawerKey(prevKey => prevKey + 1);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  useEffect(() => {
    fetchJobs(true);
  }, []);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Job Title"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-grow border border-gray-200 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="border border-gray-200 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Job Type</option>
            <option value="full-time">Full-time</option>
            <option value="contract">Contract</option>
          </select>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border border-gray-200 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Location</option>
            <option value="San Francisco">San Francisco</option>
            <option value="Remote">Remote</option>
          </select>
          <select
            className="border border-gray-200 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="All">Date posted</option>
            <option value="Past 24 hours">Past 24 hours</option>
            <option value="Last 3 days">Last 3 days</option>
            <option value="Last week">Last week</option>
            <option value="Last month">Last month</option>
          </select>
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm transition duration-300 ease-in-out"
          >
            Search
          </button>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="w-1/3 overflow-y-auto custom-scrollbar" style={{ maxHeight: '80vh' }}>
          {jobs.map((job, index) => (
            <div
              ref={jobs.length === index + 1 ? lastJobElementRef : null}
              key={job.external_job_id}
              className={`bg-white border border-gray-100 p-4 mb-3 rounded-md shadow-sm transition duration-300 ease-in-out cursor-pointer ${selectedJob?.external_job_id === job.external_job_id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-100'
                }`}
              onClick={() => setSelectedJob(job)}
            >
              <div className="flex items-center mb-2">
                {job.company_logo ? (
                  <img src={job.company_logo} alt={job.company} className="w-8 h-8 mr-2 rounded-full" />
                ) : (
                  <div className="w-8 h-8 mr-2 bg-gray-200 flex items-center justify-center rounded-full text-gray-600">
                    {job.company.charAt(0)}
                  </div>
                )}
                <h2 className="text-lg font-semibold text-gray-800">{job.title}</h2>
              </div>
              <p className="text-sm text-gray-600">{job.company}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">{job.job_type}</span>
                <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium">{job.location}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Posted {dayjs(job.posted_at).fromNow()}</p>
            </div>
          ))}
          {loading && <p className="text-center">Loading more jobs...</p>}
        </div>

        <div className="w-2/3 bg-white border border-gray-100 p-6 rounded-md shadow-sm">
          {selectedJob ? (
            <JobDetails job={selectedJob} onApply={handleApplyClick} />
          ) : (
            <p className="text-gray-500 text-center">Select a job to view details</p>
          )}
        </div>
      </div>
      <ApplyDrawer
        key={drawerKey}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        job={selectedJob}
      />
    </>
  );
};

export default JobList;

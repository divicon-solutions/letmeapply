'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Job } from '../types/job';
import ApplyDrawer from './ApplyDrawer';

dayjs.extend(relativeTime);

const JobList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('All');
  const [searchText, setSearchText] = useState<string>('');
  const [jobType, setJobType] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalDocs, setTotalDocs] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchJobs = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      searchText,
      jobType,
      location,
      datePosted: dateFilter !== 'All' ? dateFilter : '',
    });

    const response = await fetch(`/api/job?${queryParams.toString()}`);
    const data = await response.json();

    if (response.ok) {
      setJobs((prevJobs) => (page === 1 ? data.data : [...prevJobs, ...data.data]));
      setTotalDocs(data.totalDocs);
    } else {
      console.error('Failed to fetch jobs:', data.error);
    }
    setLoading(false);
  }, [page, pageSize, searchText, jobType, location, dateFilter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const lastJobElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page * pageSize < totalDocs && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [page, pageSize, totalDocs, loading]
  );

  const handleDateFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDateFilter(event.target.value);
    setPage(1);
    setJobs([]);
  };

  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setPage(1);
    setJobs([]);
  };

  const handleJobTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setJobType(event.target.value);
    setPage(1);
    setJobs([]);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(event.target.value);
    setPage(1);
    setJobs([]);
  };

  const handleApplyClick = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Job Title"
            value={searchText}
            onChange={handleSearchTextChange}
            className="flex-grow border border-gray-200 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={jobType}
            onChange={handleJobTypeChange}
            className="border border-gray-200 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
          </select>
          <select
            value={location}
            onChange={handleLocationChange}
            className="border border-gray-200 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Location</option>
            <option value="San Francisco">San Francisco</option>
            <option value="Remote">Remote</option>
          </select>
          <select
            className="border border-gray-200 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={dateFilter}
            onChange={handleDateFilterChange}
          >
            <option value="All">Date posted</option>
            <option value="Past 24 hours">Past 24 hours</option>
            <option value="Last 3 days">Last 3 days</option>
            <option value="Last week">Last week</option>
            <option value="Last month">Last month</option>
          </select>
          <button
            onClick={() => {
              setPage(1);
              setJobs([]);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm transition duration-300 ease-in-out"
          >
            Search
          </button>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="w-1/3 overflow-y-auto custom-scrollbar" style={{ maxHeight: '80vh' }}>
          {jobs.map((job, index) => {
            const isLastJob = jobs.length === index + 1;
            return (
              <div
                ref={isLastJob ? lastJobElementRef : null}
                key={job.job_id}
                className={`bg-white border border-gray-100 p-4 mb-3 rounded-md shadow-sm transition duration-300 ease-in-out cursor-pointer ${selectedJobId === job.job_id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-100'
                  }`}
                onClick={() => setSelectedJobId(job.job_id)}
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
            );
          })}
        </div>

        <div className="w-2/3 bg-white border border-gray-100 p-6 rounded-md shadow-sm">
          {selectedJobId ? (
            <>
              {jobs.map((job) => job.job_id === selectedJobId && (
                <div key={job.job_id}>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl font-bold text-gray-800 truncate">{job.title}</h2>
                      <p className="text-sm text-gray-500 mt-1">Posted {dayjs(job.posted_at).fromNow()}</p>
                    </div>
                    <button
                      onClick={handleApplyClick}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm transition duration-300 ease-in-out flex-shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                  <div className="flex items-center mb-4">
                    {job.company_logo ? (
                      <img src={job.company_logo} alt={job.company} className="w-10 h-10 mr-3 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 mr-3 bg-gray-200 flex items-center justify-center rounded-full text-gray-600">
                        {job.company.charAt(0)}
                      </div>
                    )}
                    <p className="text-lg font-semibold text-gray-800">{job.company}</p>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-medium">{job.job_type}</span>
                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-sm font-medium">{job.location}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Job Description</h3>
                  <p className="text-gray-600">{job.description}</p>
                </div>
              ))}
            </>
          ) : (
            <p className="text-gray-500 text-center">Select a job to view details</p>
          )}
        </div>
      </div>
      <ApplyDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} />
    </>
  );
};

export default JobList;

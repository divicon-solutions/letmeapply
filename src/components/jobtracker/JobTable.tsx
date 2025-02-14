import { memo } from 'react';
import { motion } from 'framer-motion';
import { JobData, JobStatus, locationColorMap, statusColorMap, statusOptions } from './constants';

interface JobTableProps {
  jobs: JobData[];
  isLoading: boolean;
  onStatusUpdate: (extractionId: number, status: JobStatus) => void;
}

const JobTable = memo(({ jobs, isLoading, onStatusUpdate }: JobTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#15ae5c]"></div>
          <span className="ml-2 text-gray-500">Loading jobs...</span>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 text-center text-gray-500">
        No jobs found
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden">
      {/* Table Header - Fixed */}
      <div className="mb-2 grid grid-cols-4 gap-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-gray-500 sticky top-0 shadow-sm">
        <div>Position / Role</div>
        <div>Company</div>
        <div>Location</div>
        <div>Interview Stage</div>
      </div>

      {/* Table Body */}
      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-300px)] pr-2">
        {jobs.map((job) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-4 gap-4 px-4 py-3 rounded-lg items-center bg-white/50 hover:bg-white/80 backdrop-blur-sm transition-all duration-200"
          >
            {/* Position */}
            <div className="text-sm font-medium">
              <a
                href={job.extraction.page_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>{job.extraction.job_title}
              </a>
            </div>

            {/* Company */}
            <div className="text-sm text-gray-900">
              {job.extraction.company}
            </div>

            {/* Location Type */}
            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${locationColorMap[job.extraction.location as keyof typeof locationColorMap] || 'bg-gray-100 text-gray-800'}`}>
                {job.extraction.location}
              </span>
            </div>

            {/* Status */}
            <div>
              <select
                value={job.status}
                onChange={(e) => onStatusUpdate(job.extraction_id, e.target.value as JobStatus)}
                className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${statusColorMap[job.status]} focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

JobTable.displayName = 'JobTable';

export default JobTable; 
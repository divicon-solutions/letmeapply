import React from 'react';
import dayjs from 'dayjs';
import { Job } from '../types/job';

interface JobDetailsProps {
    job: Job;
    onApply: () => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ job, onApply }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-gray-800 truncate">{job.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">Posted {dayjs(job.posted_at).fromNow()}</p>
                </div>
                <button
                    onClick={onApply}
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
            <p className="text-gray-600">{job.desc}</p>
        </div>
    );
};

export default JobDetails;

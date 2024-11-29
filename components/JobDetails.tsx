import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Job } from '../types/job';
import { FaExternalLinkAlt, FaEnvelopeOpenText } from 'react-icons/fa';
import { useTabCounts } from '@/lib/hooks/useTabCounts';
import GenerateCLDrawer from './GenerateCLDrawer';

interface JobDetailsProps {
    job: Job;
    onTailorResume: () => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ job, onTailorResume }) => {
    const { refetch } = useTabCounts();
    const [isClDrawerOpen, setIsClDrawerOpen] = useState(false);

    const handleDirectApply = async () => {
        console.log('handleDirectApply');
        try {
            // First create the job interaction
            fetch('/api/job-interaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    job_id: job.job_id.toString(),
                    external_job_id: job.external_job_id,
                }),
            }).then(async () => {
                await refetch();
            });

            // Then open the job application link in a new tab
            if (job.link) {
                window.open(job.link, '_blank');
            }
        } catch (error) {
            console.error('Error recording job interaction:', error);
            // Still open the link even if recording fails
            if (job.link) {
                window.open(job.link, '_blank');
            }
        }
    };

    const handleGenerateCoverLetter = () => {
        setIsClDrawerOpen(true);
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-gray-800 truncate">{job.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">Posted {dayjs(job.posted_at).fromNow()}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <button
                        onClick={onTailorResume}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm transition duration-300 ease-in-out flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Tailor & Apply
                    </button>
                    <button
                        onClick={handleDirectApply}
                        className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-md text-sm transition duration-300 ease-in-out flex items-center justify-center"
                    >
                        Just Apply
                        <FaExternalLinkAlt className="ml-2" />
                    </button>
                    <button
                        onClick={handleGenerateCoverLetter}
                        className="border border-green-600 text-green-600 hover:bg-green-50 font-medium px-4 py-2 rounded-md text-sm transition duration-300 ease-in-out flex items-center justify-center"
                    >
                        Generate Cover Letter
                        <FaEnvelopeOpenText className="ml-2" />
                    </button>
                </div>
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
            <GenerateCLDrawer
                isOpen={isClDrawerOpen}
                onClose={() => setIsClDrawerOpen(false)}
                job={job}
            />
        </>
    );
};

export default JobDetails;

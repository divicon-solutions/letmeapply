'use client';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useJobInteractions } from '@/lib/hooks/useJobInteractions';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useEffect, useState } from 'react';
import { FaExternalLinkAlt, FaTrash, FaArrowRight, FaPlus } from 'react-icons/fa';
import AddJobDialog from './AddJobDialog';

dayjs.extend(relativeTime);

interface AppliedJobsProps {
    activeTab?: string;
}

const AppliedJobs = ({ activeTab }: AppliedJobsProps) => {
    const {
        interactions,
        isLoading,
        error,
        deleteInteraction,
        updateInteraction,
        isDeleting,
        isUpdating,
        refetch
    } = useJobInteractions('applied');

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    useEffect(() => {
        refetch();
    }, [activeTab, refetch]);

    const handleDelete = async (interactionId: string) => {
        if (window.confirm('Are you sure you want to remove this job from your applied list?')) {
            try {
                await deleteInteraction(interactionId);
            } catch (error) {
                console.error('Error deleting job interaction:', error);
            }
        }
    };

    const handleMoveToConsideration = async (interactionId: string) => {
        try {
            await updateInteraction({
                interactionId,
                newStatus: 'under_consideration'
            });
        } catch (error) {
            console.error('Error moving job to under consideration:', error);
        }
    };

    const handleAddJob = async (jobData: { title: string; company: string; location: string; link: string }) => {
        try {
            const response = await fetch('/api/job-interaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    job_id: Date.now().toString(), // Generate a unique ID
                    external_job_id: `manual_${Date.now()}`,
                    title: jobData.title,
                    company: jobData.company,
                    location: jobData.location,
                    status: 'applied',
                    link: jobData.link
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add job');
            }

            refetch();
        } catch (error) {
            console.error('Error adding job:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4">
                Error loading applied jobs. Please try again later.
            </div>
        );
    }

    if (!interactions?.length) {
        return (
            <div className="text-center text-gray-500 p-4">
                No applied jobs found.
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Applied Jobs</h2>
                    <button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <FaPlus className="w-4 h-4" />
                        <span>Add Job</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Job Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Company
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Applied At
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {interactions.map((interaction) => (
                                <tr key={interaction.interaction_id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {interaction.jobs.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="text-sm text-gray-500">
                                                {interaction.jobs.company}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {interaction.jobs.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {dayjs(interaction.updated_at).fromNow()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center space-x-4">
                                            <button
                                                onClick={() => handleMoveToConsideration(interaction.interaction_id)}
                                                disabled={isUpdating}
                                                className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                                                title="Move to Under Consideration"
                                            >
                                                <FaArrowRight className="w-4 h-4" />
                                            </button>
                                            <a
                                                href={interaction.jobs.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                                title="View Job"
                                            >
                                                View Job
                                                <FaExternalLinkAlt className="w-3 h-3" />
                                            </a>
                                            <button
                                                onClick={() => handleDelete(interaction.interaction_id)}
                                                disabled={isDeleting}
                                                className="text-gray-500 hover:text-gray-600 disabled:opacity-50"
                                                title="Remove from Applied"
                                            >
                                                <FaTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <AddJobDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                onSubmit={handleAddJob}
            />
        </>
    );
};

export default AppliedJobs;

'use client';

import { FaCheck, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useJobInteractions } from '@/lib/hooks/useJobInteractions';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useEffect } from 'react';

dayjs.extend(relativeTime);

interface JobsClickedProps {
    activeTab?: string;
}

const JobsClicked = ({ activeTab }: JobsClickedProps) => {
    const {
        interactions,
        isLoading,
        error,
        updateInteraction,
        isUpdating,
        refetch,
        deleteInteraction,
    } = useJobInteractions('clicked');

    useEffect(() => {
        refetch();
    }, [activeTab, refetch]);

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
                Error loading interactions. Please try again later.
            </div>
        );
    }

    if (!interactions?.length) {
        return (
            <div className="text-center text-gray-500 p-4">
                No clicked jobs found.
            </div>
        );
    }

    const handleDelete = async (interactionId: string) => {
        await deleteInteraction(interactionId);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
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
                                Clicked At
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mark as applied
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
                                    <div className="text-sm text-gray-500">{interaction.jobs.company}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{interaction.jobs.location}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {dayjs(interaction.created_at).fromNow()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => updateInteraction({
                                                interactionId: interaction.interaction_id,
                                                newStatus: 'applied'
                                            })}
                                            disabled={isUpdating}
                                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                            title="Mark as Applied"
                                        >
                                            <FaCheck className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(interaction.interaction_id)}
                                            disabled={isUpdating}
                                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                            title="Mark as Rejected"
                                        >
                                            <FaTimes className="w-5 h-5" />
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
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JobsClicked;

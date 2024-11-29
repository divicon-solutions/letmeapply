'use client';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useJobInteractions } from '@/lib/hooks/useJobInteractions';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useEffect } from 'react';
import { FaExternalLinkAlt, FaTrash, FaArrowLeft } from 'react-icons/fa';

dayjs.extend(relativeTime);

interface UnderConsiderationProps {
    activeTab?: string;
}

const UnderConsideration = ({ activeTab }: UnderConsiderationProps) => {
    const {
        interactions,
        isLoading,
        error,
        updateInteraction,
        isUpdating,
        refetch
    } = useJobInteractions('under_consideration');

    useEffect(() => {
        refetch();
    }, [activeTab, refetch]);

    const handleMarkAsApplied = async (interactionId: string) => {
        try {
            await updateInteraction({
                interactionId,
                newStatus: 'applied'
            });
        } catch (error) {
            console.error('Error updating job status:', error);
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
                Error loading jobs under consideration. Please try again later.
            </div>
        );
    }

    if (!interactions?.length) {
        return (
            <div className="text-center text-gray-500 p-4">
                No jobs under consideration found.
            </div>
        );
    }

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
                                Added At
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
                                            onClick={() => handleMarkAsApplied(interaction.interaction_id)}
                                            disabled={isUpdating}
                                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                            title="Move to Applied"
                                        >
                                            <FaArrowLeft className="w-4 h-4" />
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

export default UnderConsideration; 
'use client';

import { useState } from 'react';

interface AddJobDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (jobData: { title: string; company: string; location: string; link: string }) => void;
}

const AddJobDialog = ({ isOpen, onClose, onSubmit }: AddJobDialogProps) => {
    const [jobData, setJobData] = useState({
        title: '',
        company: '',
        location: '',
        link: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(jobData);
        setJobData({ title: '', company: '', location: '', link: '' });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Add Job Manually</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Job Title *
                            </label>
                            <input
                                type="text"
                                required
                                value={jobData.title}
                                onChange={(e) => setJobData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company *
                            </label>
                            <input
                                type="text"
                                required
                                value={jobData.company}
                                onChange={(e) => setJobData(prev => ({ ...prev, company: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location *
                            </label>
                            <input
                                type="text"
                                required
                                value={jobData.location}
                                onChange={(e) => setJobData(prev => ({ ...prev, location: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Link *
                            </label>
                            <input
                                type="text"
                                required
                                value={jobData.link}
                                onChange={(e) => setJobData(prev => ({ ...prev, link: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                        >
                            Add Job
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddJobDialog; 
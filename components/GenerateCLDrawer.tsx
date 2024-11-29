'use client';

import React, { useState, useEffect } from 'react';
import { Job } from '@/types/job';
import { FaBuilding, FaFileAlt } from 'react-icons/fa';

interface GenerateCLDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job;
}

const GenerateCLDrawer: React.FC<GenerateCLDrawerProps> = ({ isOpen, onClose, job }) => {
    const [resume, setResume] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState<string>('');
    const [companyName, setCompanyName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (job) {
            setJobDescription(job.desc);
            setCompanyName(job.company);
        }
    }, [job]);

    const handleFileChange = (file: File | null) => {
        if (file) {
            setResume(file);
        }
    };

    const handleProceed = async () => {
        if (!resume) return;

        setIsLoading(true);
        try {
            // API call logic will go here
            console.log('Generating cover letter...');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={onClose}></div>
            )}
            <div
                className={`fixed inset-y-0 right-0 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                style={{ width: '75%' }}
            >
                <div className="p-6 flex flex-col h-full">
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
                    <h2 className="text-2xl font-bold mb-4">Generate Cover Letter</h2>

                    <div className="flex gap-6 flex-1 overflow-hidden">
                        {/* Left Section */}
                        <div className="w-1/3 flex flex-col">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaBuilding className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter company name"
                                    />
                                </div>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Resume
                                </label>
                                <div className="flex-grow flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-lg p-6">
                                    <div className="text-center">
                                        <FaFileAlt className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-1 text-sm text-gray-600">
                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                                <span>Upload a file</span>
                                                <input
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                                                    accept=".pdf,.doc,.docx"
                                                />
                                            </label>
                                            {' '}or drag and drop
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                                    </div>
                                </div>
                                {resume && (
                                    <p className="mt-2 text-sm text-gray-600">Selected: {resume.name}</p>
                                )}
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="w-2/3 flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description
                            </label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className="flex-1 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter job description"
                            />
                        </div>
                    </div>

                    {/* Bottom Button */}
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleProceed}
                            disabled={!resume || isLoading}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                        >
                            {isLoading ? 'Generating...' : 'Proceed'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GenerateCLDrawer; 
"use client";

import React, { useState, useEffect } from 'react';
import { RESUME_JD_MATCH_API_URL } from '../app-config';
import { Job } from '@/types/job';
import { Resume } from '@/types/resume';

interface ApplyDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job;
}

const ApplyDrawer: React.FC<ApplyDrawerProps> = ({ isOpen, onClose, job }) => {
    const [resume, setResume] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState<string>('');
    const [matchScore, setMatchScore] = useState<number | null>(null);
    const [suggestions, setSuggestions] = useState<string | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showManageResumes, setShowManageResumes] = useState(false);
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
    const [readyToSubmit, setReadyToSubmit] = useState<boolean>(false);

    useEffect(() => {
        if (job) {
            setJobDescription(job.desc);
        }
    }, [job]);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const response = await fetch('/api/resume');
            if (response.ok) {
                const data = await response.json();
                setResumes(data);
            } else {
                console.error('Failed to fetch resumes');
            }
        } catch (error) {
            console.error('Error fetching resumes:', error);
        }
    };

    const handleFileChange = (file: File) => {
        setError(false);
        setResume(file);
        if (showAnalysis) {
            handleAnalyze(file);
        }
    };

    const handleAnalyze = async (fileToAnalyze: File | null = null) => {
        const resumeToAnalyze = fileToAnalyze || resume;
        if (!resumeToAnalyze) {
            setError(true);
            return;
        }

        setIsLoading(true);
        setReadyToSubmit(false);
        try {
            const formData = new FormData();
            formData.append('resume', resumeToAnalyze);
            formData.append('job_desc', jobDescription);

            const response = await fetch(`${RESUME_JD_MATCH_API_URL}/match`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setMatchScore(data.match_score);
                setSuggestions(data.suggestions);
                setShowAnalysis(true);
                setReadyToSubmit(true);
            } else {
                console.error('Failed to analyze resume and job description');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const ManageResumesDialog = () => {
        const [isAdding, setIsAdding] = useState(false);
        const [newLabel, setNewLabel] = useState('');
        const [newResume, setNewResume] = useState<File | null>(null);

        const handleAdd = () => {
            setIsAdding(true);
        };

        const handleCancel = () => {
            setIsAdding(false);
            setNewLabel('');
            setNewResume(null);
        };

        const handleSave = async () => {
            if (newLabel && newResume) {
                const formData = new FormData();
                formData.append('file', newResume);
                formData.append('label', newLabel);

                try {
                    const response = await fetch('/api/resume', {
                        method: 'POST',
                        body: formData,
                    });

                    if (response.ok) {
                        fetchResumes(); // Refresh the list of resumes
                        handleCancel();
                    } else {
                        console.error('Failed to upload resume');
                    }
                } catch (error) {
                    console.error('Error uploading resume:', error);
                }
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg shadow-2xl w-11/12 max-w-4xl flex flex-col" style={{ maxHeight: '90vh' }}>
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 flex justify-between items-center rounded-t-lg">
                        <h2 className="text-2xl font-bold text-white">Manage Resumes</h2>
                        <button
                            onClick={() => setShowManageResumes(false)}
                            className="text-white hover:text-gray-200 transition duration-150"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-grow overflow-y-auto p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {resumes.map((resume, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{resume.label}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resume.resume}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                                <button
                                                    onClick={() => console.log(`Downloading ${resume.resume}`)}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                    title="Download"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setResumes(resumes.filter((_, i) => i !== index))}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-b-lg">
                        {isAdding ? (
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Resume</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label htmlFor="resume-label" className="block text-sm font-medium text-gray-700">Label</label>
                                        <input
                                            type="text"
                                            id="resume-label"
                                            placeholder="Enter label"
                                            value={newLabel}
                                            onChange={(e) => setNewLabel(e.target.value)}
                                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="resume-file" className="block text-sm font-medium text-gray-700">Resume File</label>
                                        <input
                                            type="file"
                                            id="resume-file"
                                            onChange={(e) => setNewResume(e.target.files?.[0] || null)}
                                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end space-x-2">
                                    <button
                                        onClick={handleSave}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleAdd}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Add New Resume
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (showAnalysis) {
            return (
                <div className="flex gap-6 h-full">
                    <div className="w-1/2 bg-gray-50 p-6 rounded-lg shadow-md overflow-auto">
                        <h3 className="text-xl font-semibold mb-4">Resume Analysis</h3>
                        <div className="mb-6">
                            <p className="text-lg font-medium">Match Score:</p>
                            <div className="flex items-center mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                                    <div
                                        className="bg-blue-600 h-4 rounded-full"
                                        style={{ width: `${matchScore}%` }}
                                    ></div>
                                </div>
                                <span className="text-lg font-bold">{matchScore !== null ? `${matchScore.toFixed(2)}%` : 'N/A'}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-lg font-medium mb-2">Suggestions:</p>
                            <div
                                dangerouslySetInnerHTML={{ __html: suggestions || 'No suggestions available.' }}
                                className="text-sm space-y-2 bg-white p-4 rounded-md shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Resume Modification</h3>
                            <p className="mb-4">Based on the analysis, we recommend making some changes to your resume. Please follow these steps:</p>
                            <ol className="list-decimal list-inside space-y-2 mb-6">
                                <li>Download your current resume</li>
                                <li>Make the suggested changes using your preferred editing tool</li>
                                <li>Save your updated resume</li>
                                <li>Upload the modified resume below</li>
                            </ol>
                            <div className="mb-4">
                                <button
                                    onClick={() => {
                                        // Implement download logic here
                                        console.log("Downloading current resume");
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition duration-300 ease-in-out mr-4"
                                >
                                    Download Current Resume
                                </button>
                            </div>
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload modified resume</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition duration-300 ease-in-out">
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="file-upload-modified" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                <span>Upload a file</span>
                                                <input
                                                    id="file-upload-modified"
                                                    name="file-upload-modified"
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0] || null;
                                                        if (file) handleFileChange(file);
                                                    }}
                                                    accept=".docx,.txt,.pdf"
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">DOCX, PDF, or TXT up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                            {isLoading && (
                                <p className="mt-4 text-blue-600">Analyzing updated resume...</p>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex gap-6 h-full">
                <div className="w-2/5 bg-gray-50 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Resume Selection</h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Choose from saved resumes</label>
                        <div className="relative">
                            <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none">
                                <option>Select a resume</option>
                                {resumes.map((resume, index) => (
                                    <option key={index}>{resume.label}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center my-4">
                        <hr className="flex-grow border-gray-300" />
                        <span className="mx-2 text-sm text-gray-500">Or</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload a new resume</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition duration-300 ease-in-out">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                        <span>Upload a file</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                if (file) handleFileChange(file);
                                            }}
                                            accept=".docx,.txt,.pdf"
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">DOCX, PDF, or TXT up to 10MB</p>
                            </div>
                        </div>
                    </div>
                    {error && <p className="text-red-500 mt-2">Please select your resume.</p>}
                    <div className="mt-4 text-right">
                        <button
                            onClick={() => setShowManageResumes(true)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            Manage Resumes
                        </button>
                    </div>
                </div>
                <div className="w-3/5">
                    <h3 className="text-xl font-semibold mb-4">Job Description</h3>
                    <textarea
                        className="border border-gray-300 p-4 rounded-md w-full h-[calc(100%-6rem)] resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Enter the job description here..."
                    />
                </div>
            </div>
        );
    };

    useEffect(() => {
        // ... (previous code)

        return () => {
            // Reset state when component unmounts
            setResume(null);
            setJobDescription('Job description goes here...');
            setMatchScore(null);
            setSuggestions(null);
            setError(false);
            setIsLoading(false);
            setShowAnalysis(false);
            setReadyToSubmit(false);
        };
    }, [isOpen, onClose]);

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40"
                    onClick={onClose}
                ></div>
            )}
            <div className={`fixed inset-y-0 right-0 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ width: '75%' }}>
                <div className="p-6 relative h-full flex flex-col">
                    <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                        &times;
                    </button>
                    <h2 className="text-2xl font-bold mb-4">{job ? job.title : 'Apply for Job'}</h2>
                    <div className="flex-grow overflow-y-auto">
                        {renderContent()}
                    </div>
                    <div className="mt-4">
                        {!showAnalysis ? (
                            <button
                                onClick={() => handleAnalyze()}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Analyzing...' : 'Analyze Resume'}
                            </button>
                        ) : (
                            <button
                                onClick={onClose}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                                disabled={isLoading || !readyToSubmit}
                            >
                                {isLoading ? (
                                    'Analyzing...'
                                ) : (
                                    <>
                                        Apply
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {showManageResumes && <ManageResumesDialog />}
        </>
    );
};

export default ApplyDrawer;

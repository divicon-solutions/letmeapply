"use client";

import React, { useState, useEffect } from 'react';
import { RESUME_JD_MATCH_API_URL } from '../app-config';
import { Job } from '@/types/job';
import { FaExternalLinkAlt } from 'react-icons/fa'; // Import the external link icon

interface ApplyDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job | null;
}

const ApplyDrawer: React.FC<ApplyDrawerProps> = ({ isOpen, onClose, job }) => {
    const [resume, setResume] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState<string>('');
    const [matchScore, setMatchScore] = useState<number | null>(null);
    const [suggestions, setSuggestions] = useState<string | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showAnalysis, setShowAnalysis] = useState<boolean>(false);

    useEffect(() => {
        if (job) {
            setJobDescription(job.desc);
        }
    }, [job]);

    const handleFileChange = (file: File | null) => {
        if (file) {
            setError(false);
            setResume(file);
        }
    };

    const handleAnalyze = async () => {
        if (!resume) {
            setError(true);
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('resume', resume);
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
            } else {
                console.error('Failed to analyze resume and job description');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = () => {
        if (job && job.link) {
            window.open(job.link, '_blank');
        }
        // onClose();
    };

    const renderContent = () => {
        if (showAnalysis) {
            return (
                <div className="flex flex-col h-full">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 flex-shrink-0">
                        <p className="text-blue-700">
                            Here&apos;s the analysis of your resume against the job description. Use the suggestions to improve your resume and re-upload for a better match score.
                        </p>
                    </div>
                    <div className="flex gap-6 flex-1 min-h-0">
                        <div className="w-1/3 flex flex-col items-center flex-shrink-0">
                            <div className="w-48 h-48 mb-4 flex items-center justify-center">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="#e6e6e6"
                                        strokeWidth="10"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        fill="none"
                                        stroke="#4f46e5"
                                        strokeWidth="10"
                                        strokeDasharray={`${2 * Math.PI * 45}`}
                                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - (matchScore || 0) / 100)}`}
                                        transform="rotate(-90 50 50)"
                                    />
                                    <text
                                        x="50"
                                        y="50"
                                        textAnchor="middle"
                                        dy=".3em"
                                        className="text-3xl fill-current text-gray-800"
                                    >
                                        {matchScore !== null ? `${Math.round(matchScore)}%` : 'N/A'}
                                    </text>
                                </svg>
                            </div>
                            <p className="text-lg font-medium mb-4 text-center">Match Score</p>
                            <div className="mt-6 w-full">
                                <p className="text-sm text-gray-600 mb-2 text-center">Improve your resume and re-upload:</p>
                                <label className="flex flex-col items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out">
                                    <span className="mb-1">Re-Upload Modified Resume</span>
                                    <span className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</span>
                                    <input
                                        type="file"
                                        className="sr-only"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            if (file) {
                                                handleFileChange(file);
                                                handleAnalyze();
                                            }
                                        }}
                                        accept=".pdf,.doc,.docx"
                                    />
                                </label>
                                {resume && <p className="mt-2 text-xs text-gray-600 text-center">Selected: {resume.name}</p>}
                            </div>
                        </div>
                        <div className="w-2/3 bg-white p-6 rounded-lg shadow-md overflow-auto">
                            <h3 className="text-xl font-semibold mb-4 sticky top-0 bg-white">Suggestions</h3>
                            <div
                                dangerouslySetInnerHTML={{ __html: suggestions || 'No suggestions available.' }}
                                className="text-sm space-y-2"
                            />
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex flex-col h-full">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                    <p className="text-blue-700">
                        Upload your resume and we&apos;ll analyze it against the job description to provide tailoring suggestions.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row gap-6 h-full">
                    <div className="w-full md:w-[35%] flex flex-col">
                        <h3 className="text-xl font-semibold mb-4">Upload Resume</h3>
                        <div className="flex-grow flex items-center justify-center border-2 border-gray-300 border-dashed rounded-lg p-6">
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="mt-1 text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} />
                                    </label>
                                    {' '}or drag and drop
                                </p>
                                <p className="mt-1 text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                            </div>
                        </div>
                        {resume && <p className="mt-2 text-sm text-gray-600">Selected file: {resume.name}</p>}
                        {error && <p className="mt-2 text-sm text-red-600">Please upload a resume</p>}
                    </div>
                    <div className="w-full md:w-[65%] flex flex-col">
                        <h3 className="text-xl font-semibold mb-4">Job Description</h3>
                        <textarea
                            className="flex-grow p-2 border border-gray-300 rounded-lg resize-none"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        );
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
                        &times;
                    </button>
                    <h2 className="text-2xl font-bold mb-4 flex-shrink-0">{job ? job.title : 'Tailor & Apply'}</h2>
                    <div className="flex-1 overflow-hidden">
                        {renderContent()}
                    </div>
                    <div className="mt-4">
                        {!showAnalysis ? (
                            <button
                                onClick={handleAnalyze}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={isLoading || !resume}
                            >
                                {isLoading ? 'Analyzing...' : 'Analyze Resume'}
                            </button>
                        ) : (
                            <button
                                onClick={handleApply}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                                disabled={isLoading}
                            >
                                Use this Resume and Apply
                                <FaExternalLinkAlt className="ml-2" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ApplyDrawer;

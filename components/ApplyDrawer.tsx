"use client";

import React, { useState, useEffect } from 'react';
import { RESUME_JD_MATCH_API_URL } from '../app-config';
import mammoth from 'mammoth';
import Image from 'next/image';

interface ApplyDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ResumeData {
    label: string;
    resume: string;
}

const ApplyDrawer: React.FC<ApplyDrawerProps> = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [resume, setResume] = useState<File | null>(null);
    const [resumeContent, setResumeContent] = useState<string>('');
    const [jobDescription, setJobDescription] = useState<string>('Job description goes here...');
    const [matchScore, setMatchScore] = useState<number | null>(null);
    const [suggestions, setSuggestions] = useState<string | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // const [showTooltip, setShowTooltip] = useState(false);
    const [showManageResumes, setShowManageResumes] = useState(false);
    const [resumes, setResumes] = useState<ResumeData[]>([
        { label: "Resume 1", resume: "resume1.pdf" },
        { label: "Resume 2", resume: "resume2.pdf" },
        { label: "Resume 3", resume: "resume3.pdf" },
        { label: "Resume 4", resume: "resume4.pdf" },
        { label: "Resume 5", resume: "resume5.pdf" },
    ]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        } else {
            window.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const handleFileChange = (file: File) => {
        setError(false); // Clear error when a file is selected
        if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const arrayBuffer = e.target?.result as ArrayBuffer;
                const result = await mammoth.extractRawText({ arrayBuffer });
                setResumeContent(result.value);
            };
            reader.readAsArrayBuffer(file);
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setResumeContent(text);
            };
            reader.readAsText(file);
        }
    };

    const handleNextStep = async () => {
        if (currentStep === 1 && !resume) {
            setError(true);
            return;
        }

        if (currentStep === 1 && resume) {
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
                } else {
                    console.error('Failed to analyze resume and job description');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        }
        setCurrentStep((prevStep) => Math.min(prevStep + 1, 4));
    };

    const handlePreviousStep = () => {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
    };

    const handleDownload = (resumeName: string) => {
        // Implement download logic here
        console.log(`Downloading ${resumeName}`);
    };

    const handleDelete = (index: number) => {
        setResumes(resumes.filter((_, i) => i !== index));
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

        const handleSave = () => {
            if (newLabel && newResume) {
                setResumes([...resumes, { label: newLabel, resume: newResume.name }]);
                handleCancel();
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-3xl relative">
                    <button
                        onClick={() => setShowManageResumes(false)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-2xl font-bold mb-6 text-center">Manage Resumes</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 text-left font-semibold w-1/3">Label</th>
                                    <th className="p-3 text-left font-semibold w-1/3">Resume</th>
                                    <th className="p-3 text-center font-semibold w-1/3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resumes.map((resume, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="p-3 w-1/3">{resume.label}</td>
                                        <td className="p-3 w-1/3">{resume.resume}</td>
                                        <td className="p-3 text-center w-1/3">
                                            <button
                                                onClick={() => handleDownload(resume.resume)}
                                                className="mr-4 text-blue-600 hover:text-blue-800"
                                                title="Download"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(index)}
                                                className="text-red-600 hover:text-red-800"
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
                    <div className="mt-6 flex justify-center items-center">
                        {isAdding ? (
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    placeholder="Enter label"
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md"
                                />
                                <input
                                    type="file"
                                    onChange={(e) => setNewResume(e.target.files?.[0] || null)}
                                    className="border border-gray-300 p-2 rounded-md"
                                />
                                <button
                                    onClick={handleSave}
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition duration-300 ease-in-out"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition duration-300 ease-in-out"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAdd}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition duration-300 ease-in-out"
                            >
                                Add
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="flex gap-4 h-full">
                        <div className="flex flex-col items-center justify-center w-2/5">
                            <div className="w-full mb-1 text-right">
                                <button
                                    onClick={() => setShowManageResumes(true)}
                                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                                >
                                    Manage Resumes
                                </button>
                            </div>
                            <div className="relative w-full mb-4">
                                <select className="border border-gray-300 p-2 rounded-md w-full appearance-none">
                                    <option>Select a resume</option>
                                    {resumes.map((resume, index) => (
                                        <option key={index}>{resume.label}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex items-center my-4">
                                <hr className="flex-grow border-gray-300" />
                                <span className="mx-2 text-gray-500">Or</span>
                                <hr className="flex-grow border-gray-300" />
                            </div>
                            <div className="w-full">
                                <input
                                    type="file"
                                    className="border p-2 rounded-md w-full border-gray-300"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setResume(file);
                                        if (file) handleFileChange(file);
                                    }}
                                    accept=".docx,.txt"
                                />
                                {error && <p className="text-red-500 mt-5">Please select your resume.</p>}
                            </div>
                        </div>
                        <div className="w-3/5">
                            <textarea
                                className="border border-gray-300 p-2 rounded-md w-full h-full"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>
                    </div>
                );
            case 2:
                if (isLoading) {
                    return (
                        <div className="flex flex-col items-center justify-center h-full">
                            <Image src="/loading-logo.gif" alt="Loading" width={50} height={50} />
                            <p className="mt-4 text-lg">Loading, please wait...</p>
                        </div>
                    );
                }
                return (
                    <div className="flex gap-4 h-full">
                        <div className="w-2/5 overflow-auto" style={{ maxHeight: '80vh' }}>
                            <p className="mb-2">Match Score: {matchScore !== null ? `${matchScore.toFixed(2)}%` : 'Analyzing...'}</p>
                            <p className="mb-2">Suggestions:</p>
                            <div
                                dangerouslySetInnerHTML={{ __html: suggestions || 'Analyzing...' }}
                                className="text-sm space-y-2"
                            />
                        </div>
                        <div className="w-3/5">
                            <textarea
                                className="border border-gray-300 p-2 rounded-md w-full h-full"
                                value={resumeContent}
                                onChange={(e) => setResumeContent(e.target.value)}
                            />
                        </div>
                    </div>
                );
            case 3:
                return <p>Apply Changes: Make any necessary changes before applying.</p>;
            case 4:
                return <p>Apply the Job: Finalize and submit your application.</p>;
            default:
                return null;
        }
    };

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
                    <h2 className="text-2xl font-bold mb-4">Apply for Job</h2>
                    <div className="flex justify-between items-center mb-8">
                        {['Resume/JD Selection', 'Resume/JD Match Score', 'Apply Changes', 'Apply the Job'].map((label, index) => (
                            <div key={index} className="flex flex-col items-center flex-1">
                                <div className="flex items-center">
                                    <div
                                        className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${currentStep > index + 1 ? 'bg-blue-500 text-white' : currentStep === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
                                            }`}
                                    >
                                        {currentStep > index + 1 ? (
                                            <span>&#10003;</span>
                                        ) : (
                                            <span>{index + 1}</span>
                                        )}
                                    </div>
                                    {index < 3 && (
                                        <div className="flex-1 h-0.5 bg-gray-300 mx-2">
                                            <div className={`w-full h-0.5 ${currentStep > index + 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                        </div>
                                    )}
                                </div>
                                <span className={`text-xs ${currentStep === index + 1 ? 'text-black' : 'text-gray-500'} mt-1`}>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex-grow overflow-y-auto">{renderStepContent()}</div>
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={handlePreviousStep}
                            className="bg-gray-300 hover:bg-gray-400 text-black font-medium px-4 py-2 rounded-md"
                            disabled={currentStep === 1}
                        >
                            Back
                        </button>
                        <button
                            onClick={currentStep === 4 ? onClose : handleNextStep}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md"
                        >
                            {currentStep === 4 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
            {showManageResumes && <ManageResumesDialog />}
        </>
    );
};

export default ApplyDrawer;

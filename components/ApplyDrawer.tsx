"use client";

import React, { useState, useEffect } from 'react';
import { RESUME_JD_MATCH_API_URL } from '../app-config';
import mammoth from 'mammoth';

interface ApplyDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const ApplyDrawer: React.FC<ApplyDrawerProps> = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [resume, setResume] = useState<File | null>(null);
    const [resumeContent, setResumeContent] = useState<string>('');
    const [jobDescription, setJobDescription] = useState<string>('Job description goes here...');
    const [matchScore, setMatchScore] = useState<number | null>(null);
    const [suggestions, setSuggestions] = useState<string | null>(null);
    const [error, setError] = useState<boolean>(false);

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
            }
        }
        setCurrentStep((prevStep) => Math.min(prevStep + 1, 4));
    };

    const handlePreviousStep = () => {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
    };


    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="flex gap-4 h-full">
                        <div className="flex flex-col items-center justify-center w-2/5">
                            <select className="border border-gray-300 p-2 rounded-md mb-4 w-full">
                                <option>Select a resume</option>
                                <option>Resume 1</option>
                                <option>Resume 2</option>
                            </select>
                            <div className="flex items-center my-4">
                                <hr className="flex-grow border-gray-300" />
                                <span className="mx-2 text-gray-500">Or</span>
                                <hr className="flex-grow border-gray-300" />
                            </div>
                            <div className="w-full">
                                <input
                                    type="file"
                                    className={`border p-2 rounded-md w-full border-gray-300'}`}
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
        </>
    );
};

export default ApplyDrawer;

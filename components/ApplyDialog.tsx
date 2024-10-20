import React, { useState } from 'react';

interface ApplyDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const ApplyDialog: React.FC<ApplyDialogProps> = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState<number>(1);

    if (!isOpen) return null;

    const handleNextStep = () => {
        setCurrentStep((prevStep) => Math.min(prevStep + 1, 4));
    };

    const handlePreviousStep = () => {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="flex flex-col items-center">
                        <select className="border border-gray-300 p-2 rounded-md mb-4 w-full max-w-md">
                            <option>Select a resume</option>
                            <option>Resume 1</option>
                            <option>Resume 2</option>
                        </select>
                        <div className="flex items-center my-4">
                            <hr className="flex-grow border-gray-300" />
                            <span className="mx-2 text-gray-500">Or</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>
                        <input type="file" className="border border-gray-300 p-2 rounded-md w-full max-w-md" />
                    </div>
                );
            case 2:
                return <p>Resume/JD Match Score: Display the match score between your resume and the job description.</p>;
            case 3:
                return <p>Apply Changes: Make any necessary changes before applying.</p>;
            case 4:
                return <p>Apply the Job: Finalize and submit your application.</p>;
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">Apply for Job</h2>
                <div className="flex justify-between items-center mb-8">
                    {['Resume Selection', 'Resume/JD Match Score', 'Apply Changes', 'Apply the Job'].map((label, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                            <div className="flex items-center">
                                <div
                                    className={`w-8 h-8 flex items-center justify-center rounded-full ${currentStep > index + 1 ? 'bg-blue-500 text-white' : currentStep === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
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
                            <span className={`text-sm ${currentStep === index + 1 ? 'text-black' : 'text-gray-500'} mt-2`}>
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
                {renderStepContent()}
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
    );
};

export default ApplyDialog;

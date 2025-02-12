import React from 'react';
import ResumeUpload from '../ResumeUpload';
import { ProfileData } from '../../types/profile';
import toast from 'react-hot-toast';

interface ResumeButtonProps {
    onUploadSuccess: (data: ProfileData) => void;
}

const ResumeButton: React.FC<ResumeButtonProps> = ({ onUploadSuccess }) => {
    const handleResumeData = (data: ProfileData) => {
        onUploadSuccess(data);
        toast.success('Resume data loaded successfully');
    };

    return (
        <ResumeUpload isButton onUploadSuccess={handleResumeData} />
    );
};

export default ResumeButton; 
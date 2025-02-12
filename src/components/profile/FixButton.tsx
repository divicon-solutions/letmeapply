import React from 'react';
import { hasInvalidDates } from './DateFieldHelper';
import { ProfileData } from '../../types/profile';

interface FixButtonProps {
    values: ProfileData;
    onClick: () => void;
}

const FixButton: React.FC<FixButtonProps> = ({ values, onClick }) => {
    if (!hasInvalidDates(values)) {
        return null;
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-transparent hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
            Fix
        </button>
    );
};

export default FixButton; 
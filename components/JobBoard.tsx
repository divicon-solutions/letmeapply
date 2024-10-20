import { useState } from 'react';
import JobList from './job-list';
import Board from './Board';

const JobBoard = () => {
    const [activeTab, setActiveTab] = useState('Jobs');

    const renderContent = () => {
        switch (activeTab) {
            case 'Jobs':
                return <JobList />;
            case 'Applied':
                return <div>Applied Jobs Content</div>;
            case 'Under Consideration':
                return <div>Under Consideration Content</div>;
            case 'All':
                return <div>All Jobs Content</div>;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="flex space-x-4 border-b">
                {['Jobs', 'Applied', 'Under Consideration', 'All'].map((tab) => (
                    <button
                        key={tab}
                        className={`py-2 px-4 ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="mt-4">
                {renderContent()}
            </div>
        </div>
    );
};

export default JobBoard;

import { useState } from 'react';
import JobList from './job-list';
import JobsClicked from './JobsClicked';
import AppliedJobs from './AppliedJobs';
import UnderConsideration from './UnderConsideration';
import { useTabCounts } from '@/lib/hooks/useTabCounts';

const JobBoard = () => {
    const [activeTab, setActiveTab] = useState('Jobs');
    const { data: tabCounts, isLoading: isLoadingCounts } = useTabCounts();

    const tabs = [
        { id: 'Jobs', label: 'Jobs' },
        { id: 'Jobs Clicked', label: 'Jobs Clicked', count: tabCounts?.clicked },
        { id: 'Applied', label: 'Applied', count: tabCounts?.applied },
        { id: 'Under Consideration', label: 'Under Consideration', count: tabCounts?.under_consideration },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'Jobs':
                return <JobList />;
            case 'Jobs Clicked':
                return <JobsClicked activeTab={activeTab} />;
            case 'Applied':
                return <AppliedJobs activeTab={activeTab} />;
            case 'Under Consideration':
                return <UnderConsideration activeTab={activeTab} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="flex space-x-4 border-b">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`py-2 px-4 flex items-center gap-2 ${activeTab === tab.id ? 'border-b-2 border-blue-500' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                        {tab.count !== undefined && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                                {tab.count}
                            </span>
                        )}
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

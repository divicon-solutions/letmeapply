import { memo } from 'react';
import { JobStatus, statusOptions, tabStatusColorMap } from './constants';

interface StatusTabsProps {
  activeStatus: JobStatus;
  onStatusChange: (status: JobStatus) => void;
  statusCounts?: Record<JobStatus, number>;
}

const StatusTabs = memo(({ activeStatus, onStatusChange, statusCounts = {
  APPLIED: 0,
  INTERVIEWING: 0,
  OFFER_RECEIVED: 0,
  REJECTED: 0,
  ARCHIVED: 0
} }: StatusTabsProps) => {
  return (
    <div className="mb-8 flex justify-center">
      <div className="inline-flex gap-2 p-1 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
        {statusOptions.map((status) => {
          const isActive = activeStatus === status;
          const statusColors = tabStatusColorMap[status];
          const count = statusCounts[status] || 0;

          return (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${isActive
                  ? `${statusColors.active} shadow-sm`
                  : `text-gray-500 ${statusColors.inactive}`
                }
              `}
            >
              {status.replace('_', ' ')} {count > 0 && <span className="ml-1">({count})</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
});

StatusTabs.displayName = 'StatusTabs';

export default StatusTabs;
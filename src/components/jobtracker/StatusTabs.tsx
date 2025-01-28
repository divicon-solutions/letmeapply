import { memo } from 'react';
import { JobStatus, statusOptions, tabStatusColorMap } from './constants';

interface StatusTabsProps {
  activeStatus: JobStatus;
  onStatusChange: (status: JobStatus) => void;
}

const StatusTabs = memo(({ activeStatus, onStatusChange }: StatusTabsProps) => {
  return (
    <div className="mb-8 flex justify-center">
      <div className="inline-flex gap-2 p-1 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
        {statusOptions.map((status) => {
          const isActive = activeStatus === status;
          const statusColors = tabStatusColorMap[status];

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
              {status.replace('_', ' ')}
            </button>
          );
        })}
      </div>
    </div>
  );
});

StatusTabs.displayName = 'StatusTabs';

export default StatusTabs; 
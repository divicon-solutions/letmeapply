import { useState, useEffect } from 'react';

const Board = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const tabs = ['Marked', 'Applied', 'Under consideration', 'All'];

  const dummyData = [
    { id: 1, name: 'John Doe', status: 'Marked', details: 'Job details for John Doe' },
    { id: 2, name: 'Jane Smith', status: 'Applied', details: 'Job details for Jane Smith' },
    { id: 3, name: 'Alice Johnson', status: 'Under consideration', details: 'Job details for Alice Johnson' },
    { id: 4, name: 'Bob Brown', status: 'All', details: 'Job details for Bob Brown' },
  ];

  const handleRowClick = (job) => {
    setSelectedJob(job);
    setIsDrawerOpen(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsDrawerOpen(false);
    }
  };

  useEffect(() => {
    if (isDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen]);

  const renderTable = () => {
    return (
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 text-left font-semibold text-gray-700">ID</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Name</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleRowClick(item)}
            >
              <td className="py-3 px-4 border-t border-gray-200">{item.id}</td>
              <td className="py-3 px-4 border-t border-gray-200">{item.name}</td>
              <td className="py-3 px-4 border-t border-gray-200">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderDrawer = () => {
    if (!selectedJob) return null;

    return (
      <>
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsDrawerOpen(false)}
          ></div>
        )}
        <div
          className={`fixed top-16 right-0 w-3/4 h-full bg-white shadow-lg p-6 transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'transform translate-x-0' : 'transform translate-x-full'
            }`}
        >
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={() => setIsDrawerOpen(false)}
          >
            &times;
          </button>
          <h2 className="text-xl font-bold mb-4">{selectedJob.name}</h2>
          <p>{selectedJob.details}</p>
        </div>
      </>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex space-x-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="bg-white">
        {renderTable()}
      </div>
      {renderDrawer()}
    </div>
  );
};

export default Board;

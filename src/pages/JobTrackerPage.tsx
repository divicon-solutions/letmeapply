import JobTracker from '../components/jobtracker';

const JobTrackerPage = () => {
  return (
    <div className="min-h-screen bg-gray-25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Application Tracker</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track and manage your job applications in one place
          </p>
        </div> */}
        <JobTracker />
      </div>
    </div>
  );
};

export default JobTrackerPage;

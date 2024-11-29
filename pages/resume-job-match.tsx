import { useState } from 'react';
import NavWrapper from '@/components/NavWrapper';
import { ClerkProvider } from '@clerk/nextjs';

const ResumeJobMatch = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setResume(event.target.files[0]);
    }
  };

  const handleJobDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(event.target.value);
  };

  const checkMatchScore = async () => {
    if (!resume) return;

    const formData = new FormData();
    formData.append('file', resume as Blob);
    formData.append('jobDescription', jobDescription);
    formData.append('user_id', "fdfdfdf");

    const response = await fetch('/api/resume', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yblFUeEwzQk9MWEtIaDVVenVkSWhoczRrOVQiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJleHAiOjE3MjkzNDc5OTksImlhdCI6MTcyOTM0NzkzOSwiaXNzIjoiaHR0cHM6Ly9zaW5jZXJlLW1ha28tMTQuY2xlcmsuYWNjb3VudHMuZGV2IiwibmJmIjoxNzI5MzQ3OTI5LCJzaWQiOiJzZXNzXzJuYW04M0VzY0FMNTVlM0pvclc3ZVpwMEFoZiIsInN1YiI6InVzZXJfMm5RVjMyWEFKYmt4ejUzNER6SWUyRHdRY1JPIn0.F4oPgsUZInINP8sxYO5WLhMqjyk8kaOCXqRdI1hBDQ8tBdLVZJIif_TpsJMyvwqyGZlLS87UijJhYoPTKhYfWfKyFWUfKzAJhhRoUs6o6ahgZgTK1q7YSinOW417n07-CEWagoFKz8YEk0Fu5j9HW9TfFYilKT5H2Yie8sDAZWbILsSlSZmSctpPS8a0F7VJcmDKIjpGfWMKehDj7tGezH98KFYW1-IAQOclx7wNkMhnrEXOSk594ZsrGrKx9_v1by_0qZn-bHvPTnYOgau-uQDJNkHeLmD1fqTY-7AIhoBQ55_q0Wej3_azBkrwfG9yKTYmZEObsXJ58esMvYlHkA`,
      },
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <NavWrapper>
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex-1">
            <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>
            <div className="flex-grow flex items-center justify-center border-2 border-gray-300 border-dashed rounded-lg p-6 h-[250px]">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-1 text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleResumeUpload}
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                  {' '}or drag and drop
                </p>
                <p className="mt-1 text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
              </div>
            </div>
            {resume && <p className="mt-2 text-sm text-gray-600">Selected file: {resume.name}</p>}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex-1">
            <h2 className="text-xl font-semibold mb-4">Paste Job Description</h2>
            <textarea
              value={jobDescription}
              onChange={handleJobDescriptionChange}
              className="flex-grow p-2 border border-gray-300 rounded-lg resize-none h-[250px] w-full"
              placeholder="Paste the job description here..."
            />
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={checkMatchScore}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!resume || !jobDescription}
          >
            Check Match Score
          </button>
        </div>
      </div>
    </NavWrapper>
  );
};

export default ResumeJobMatch;

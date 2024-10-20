import { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
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
    console.log('Checking match score...');

    // hit this api: http://localhost:3000/api/resume
    // with the file and job description and user_id as form data

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
    <ClerkProvider>
      <NavWrapper>
        <div className="container mx-auto p-6">
          <div className="flex flex-col lg:flex-row lg:space-x-6">
            <div className="bg-white p-4 rounded-lg shadow-md flex-1">
              <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>
              <label className="w-full h-64 flex flex-col items-center justify-center px-4 py-6 bg-blue-100 text-blue-600 rounded-lg shadow-md tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-200 hover:text-blue-800 transition-colors">
                <FaCloudUploadAlt size={50} className="mb-3" />
                <span className="mt-2 text-base leading-normal">Select a file</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </label>
              {resume && <p className="mt-4 text-sm text-gray-600">{resume.name}</p>}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md flex-1">
              <h2 className="text-xl font-semibold mb-4">Paste Job Description</h2>
              <textarea
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                rows={10}
                className="w-full p-2 border border-gray-300 rounded h-64"
                placeholder="Paste the job description here..."
              />
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={checkMatchScore}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors"
            >
              Check Match Score
            </button>
          </div>
        </div>
      </NavWrapper>
    </ClerkProvider>
  );
};

export default ResumeJobMatch;

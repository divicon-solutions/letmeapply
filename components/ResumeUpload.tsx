import React, { useState, useRef } from 'react';
import { FaUpload } from 'react-icons/fa';
import { useUser, useAuth } from '@clerk/nextjs';
import { ProfileData } from '@/types/profile';
import mammoth from 'mammoth'; // For DOCX files
import toast from 'react-hot-toast'; // Import toast

interface ResumeUploadProps {
  onUploadSuccess: (data: ProfileData) => void;
  isButton?: boolean;
}

export default function ResumeUpload({ onUploadSuccess, isButton }: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const { getToken } = useAuth();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      let extractedText = '';

      if (file.type === 'application/pdf') {
        try {
          const { default: pdfToText } = await import('react-pdftotext');
          extractedText = await pdfToText(file);
          // console.log('PDF Text:', extractedText);
        } catch (error) {
          console.error("Failed to extract text from pdf:", error);
          toast.error("Failed to extract text from PDF");
          setError("Failed to extract text from PDF");
          setIsUploading(false);
          return;
        }
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        // Extract text from DOCX using Mammoth.js
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
      } else {
        throw new Error('Unsupported file type');
      }

      // console.log('Extracted Text:', extractedText);
      console.log('File Name:', file.name);

      // Send extracted text and file name to the API
      const payload = {
        resume_text: extractedText,
      };

      const response = await fetch('http://localhost:8000/api/v1/resume/parse-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('API Response not OK:', response.status, response.statusText);
        throw new Error('Failed to parse resume');
      }

      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));

      if (data && data.parsed_data) {
        // Log raw date data for debugging
        console.log('Raw Education Dates:', data.parsed_data.education?.map(edu => edu.dates));
        console.log('Raw Work Experience Dates:', data.parsed_data.workExperience?.map(work => work.dates));

        // Helper function to format date
        const formatDate = (dateStr: string | undefined, isPresent: boolean = false): string => {
          if (!dateStr || isPresent) return '';
          // If date is already in YYYY-MM-DD format, return as is
          if (dateStr.length === 10) return dateStr;
          // If date is in YYYY-MM format, append -01 for day
          if (dateStr.length === 7) return `${dateStr}-01`;
          // If it's a longer format, take first 7 chars and append -01
          return `${dateStr.substring(0, 7)}-01`;
        };

        // Transform the API response to match ProfileData structure
        const transformedData = {
          personalInfo: {
            name: data.parsed_data.personalInfo?.name || '',
            email: data.parsed_data.personalInfo?.email || '',
            phoneNumber: data.parsed_data.personalInfo?.phoneNumber || '',
            location: data.parsed_data.personalInfo?.location || null,
            linkedin: data.parsed_data.personalInfo?.linkedin || '',
            githubUrl: data.parsed_data.personalInfo?.githubUrl || ''
          },
          summary: data.parsed_data.summary || '',
          education: (data.parsed_data.education || []).map((edu: any) => ({
            organization: edu.organization || '',
            accreditation: edu.accreditation || '',
            location: edu.location || '',
            dates: {
              startDate: formatDate(edu.dates?.startDate),
              completionDate: formatDate(edu.dates?.completionDate),
              isCurrent: edu.dates?.isCurrent || false
            },
            courses: edu.courses || [],
            achievements: edu.achievements || []
          })),
          workExperience: (data.parsed_data.workExperience || []).map((work: any) => ({
            jobTitle: work.jobTitle || '',
            organization: work.organization || '',
            location: work.location || null,
            dates: {
              startDate: formatDate(work.dates?.startDate),
              completionDate: formatDate(work.dates?.completionDate),
              isCurrent: work.dates?.isCurrent || false
            },
            bulletPoints: work.bulletPoints || [],
            achievements: work.achievements || []
          })),
          skills: data.parsed_data.skills || {},
          projects: (data.parsed_data.projects || []).map((project: any) => ({
            name: project.name || '',
            bulletPoints: project.bulletPoints || [],
            dates: {
              startDate: formatDate(project.dates?.startDate),
              completionDate: formatDate(project.dates?.completionDate)
            },
            organization: project.organization || '',
            location: project.location || ''
          })),
          certifications: (data.parsed_data.certifications || []).map((cert: any) => ({
            name: cert.name || '',
            description: cert.description || ''
          })),
          achievements: (data.parsed_data.achievements || []).map((achievement: any) => ({
            name: achievement.name || '',
            description: achievement.description || ''
          })),
          languages: (data.parsed_data.languages || []).map((language: any) => ({
            name: language.name || '',
            description: language.description || ''
          })),
          publications: (data.parsed_data.publications || []).map((pub: any) => ({
            title: pub.title || '',
            description: pub.description || '',
            authors: pub.authors || []
          }))
        };

        console.log('ResumeUpload - Transformed data:', JSON.stringify(transformedData, null, 2));

        // Ensure the data is properly structured before passing it to the parent
        if (!transformedData.personalInfo || !transformedData.education || !transformedData.workExperience) {
          throw new Error('Missing required profile sections');
        }

        // Save profile to database
        try {
          const profilePayload = {
            email: user?.primaryEmailAddress?.emailAddress || transformedData.personalInfo.email,
            clerk_id: user?.id,
            resume: transformedData
          };

          console.log('Profile Payload:', JSON.stringify(profilePayload, null, 2));

          const token = await getToken();
          console.log('Auth Token:', token); // Log token for debugging

          const profileResponse = await fetch('http://localhost:8000/api/v1/profiles', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            credentials: 'include', // Include credentials in the request
            body: JSON.stringify(profilePayload),
          });

          if (!profileResponse.ok) {
            const errorData = await profileResponse.text();
            console.error('Profile API Error:', {
              status: profileResponse.status,
              statusText: profileResponse.statusText,
              error: errorData
            });
            throw new Error(`Failed to save profile: ${profileResponse.status} ${errorData}`);
          }

          const profileData = await profileResponse.json();
          console.log('Profile saved:', profileData);
        } catch (error) {
          console.error('Error saving profile:', error);
          toast.error('Failed to save profile to database');
        }

        onUploadSuccess(transformedData);
        toast.success('Resume uploaded and parsed successfully');
      } else {
        console.error('Invalid API response structure:', data);
        throw new Error('Invalid API response format');
      }
    } catch (err) {
      console.error('Error during file processing:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  if (isButton) {
    return (
      <>
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Re-upload Resume'}
        </button>
        <input
          type="file"
          className="hidden"
          id="resume-upload"
          ref={fileInputRef}
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
      </>
    );
  }

  return (
    <div className="w-full">
      <label
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer 
          ${isUploading ? 'bg-gray-100' : 'hover:bg-gray-50'} 
          transition-colors duration-200`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500">Processing resume...</p>
            </div>
          ) : (
            <>
              <FaUpload className="w-8 h-8 mb-4 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX</p>
            </>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          id="resume-upload"
          ref={fileInputRef}
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
      </label>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

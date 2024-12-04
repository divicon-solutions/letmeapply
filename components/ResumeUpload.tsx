import { useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import { ProfileData } from '@/types/profile';
import mammoth from 'mammoth'; // For DOCX files
import toast from 'react-hot-toast'; // Import toast

interface ResumeUploadProps {
  onUploadSuccess: (data: ProfileData) => void;
}

export default function ResumeUpload({ onUploadSuccess }: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        filename: file.name,
        text: extractedText,
      };

      const response = await fetch('https://us-central1-lma-project-15974.cloudfunctions.net/api/parse', {
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
      // console.log('API Response:', JSON.stringify(data, null, 2));

      // The API response already has the correct structure with a result property
      if (data && data.result) {
        // Pass the data directly since it's already in the correct format
        onUploadSuccess(data);
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
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
      </label>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

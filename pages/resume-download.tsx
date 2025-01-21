import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import { BlobProvider, PDFViewer } from '@react-pdf/renderer';
import ResumePDF from '../components/resume/ResumePDF';
import { BASE_API_URL } from '@/utils/config';
import { BsFiletypePdf } from "react-icons/bs";


interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phoneNumber: string;
    location?: string;
    linkedin?: string;
    githubUrl?: string;
  };
  summary?: string;
  education?: Array<{
    organization: string;
    accreditation: string;
    location: string;
    dates: {
      startDate: string;
      completionDate?: string;
      isCurrent: boolean;
    };
    courses?: string[];
    achievements?: string[];
  }>;
  workExperience?: Array<{
    jobTitle: string;
    organization: string;
    location?: string;
    dates: {
      startDate: string;
      completionDate?: string;
      isCurrent: boolean;
    };
    bulletPoints?: string[];
    achievements?: string[];
  }>;
  skills?: Record<string, string[]>;
  projects?: Array<{
    name: string;
    bulletPoints?: string[];
    dates?: {
      startDate: string;
      completionDate?: string;
    };
    organization?: string;
    location?: string;
  }>;
}

interface JobDetails {
  company?: string;
  // add other job details properties as needed
}

const ResumeDownload = () => {
  const router = useRouter();
  const { format, resume_id } = router.query;
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady || !resume_id) return;

    const fetchResumeData = async () => {
      try {
        const response = await fetch(`${BASE_API_URL}/api/v1/resume/tailored-resume/${resume_id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch resume data');
        }

        const responseData = await response.json();
        setResumeData(responseData.tailored_resume);
        setIsGenerating(false);
        setJobDetails(responseData.job_details);
      } catch (error) {
        console.error('Error fetching resume data:', error);
        setError('Failed to fetch resume data');
        setIsGenerating(false);
      }
    };

    fetchResumeData();
  }, [router.isReady, resume_id]);

  const getFileName = () => {
    const name = resumeData?.personalInfo?.name?.replace(/\s+/g, '_') || '';
    const company = jobDetails?.company?.replace(/\s+/g, '_') || Math.floor(Math.random() * 1000);
    return `${name}_${company}`;
  };

  const generateDOCX = async (data: ResumeData) => {
    const sections: Paragraph[] = [];

    // Header
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: data.personalInfo.name, bold: true, size: 28 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun(`${data.personalInfo.email} | ${data.personalInfo.phoneNumber}\n`),
          new TextRun(data.personalInfo.location || ''),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    );

    // Summary
    if (data.summary) {
      sections.push(
        new Paragraph({
          text: "SUMMARY",
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: data.summary,
          spacing: { after: 400 }
        })
      );
    }

    // Work Experience
    if (data.workExperience?.length) {
      sections.push(
        new Paragraph({
          text: "WORK EXPERIENCE",
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 }
        })
      );

      data.workExperience.forEach(job => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: job.jobTitle, bold: true }),
              new TextRun(` at ${job.organization}`),
              new TextRun({
                text: ` (${job.dates.startDate} - ${job.dates.isCurrent ? 'Present' : job.dates.completionDate})`,
                bold: true
              })
            ],
            spacing: { after: 200 }
          })
        );

        job.bulletPoints?.forEach(point => {
          sections.push(
            new Paragraph({
              text: `• ${point}`,
              spacing: { after: 100 }
            })
          );
        });
      });
    }

    // Generate and download
    const doc = new Document({
      sections: [{
        properties: {},
        children: sections
      }]
    });

    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${getFileName()}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    window.close();
  };

  const handleDownload = (url: string, format: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${getFileName()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isGenerating) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-4">
          <p className="mb-2">Generating your resume...</p>
          <p className="text-sm text-gray-600">Please wait while we prepare your resume.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!resumeData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-end space-x-4 mb-4">
            <BlobProvider document={<ResumePDF data={resumeData} />}>
              {({ url, loading, error: pdfError }) => (
                <button
                  onClick={() => url && handleDownload(url, 'pdf')}
                  disabled={loading || !!pdfError}
                  className="px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
                >
                  <BsFiletypePdf />
                  <span>Download PDF</span>
                </button>
              )}
            </BlobProvider>
            <button
              onClick={() => generateDOCX(resumeData)}
              className="px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
              <span>Download DOCX</span>
            </button>
          </div>
          <div className="w-full h-[800px] border border-gray-200 rounded-lg">
            <PDFViewer width="100%" height="100%" className="rounded-lg">
              <ResumePDF data={resumeData} />
            </PDFViewer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDownload;

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import { BlobProvider, PDFViewer } from '@react-pdf/renderer';
import ResumePDF from '../components/resume/ResumePDF';
import { BASE_API_URL } from '@/utils/config';

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

const ResumeDownload = () => {
  const router = useRouter();
  const { format, resume_id } = router.query;
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
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
      } catch (error) {
        console.error('Error fetching resume data:', error);
        setError('Failed to fetch resume data');
        setIsGenerating(false);
      }
    };

    fetchResumeData();
  }, [router.isReady, resume_id]);

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
    link.download = 'resume.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    window.close();
  };

  const handleDownload = (url: string, format: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume.${format}`;
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
          <h1 className="text-2xl font-bold mb-4">Resume Preview</h1>
          <div className="flex justify-end space-x-4 mb-4">
            <button
              onClick={() => {
                if (format === 'docx') {
                  generateDOCX(resumeData);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Download {typeof format === 'string' ? format.toUpperCase() : ''}
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

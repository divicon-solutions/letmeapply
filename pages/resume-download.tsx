import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import { BlobProvider } from '@react-pdf/renderer';
import ResumePDF from '../components/resume/ResumePDF';

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
  const { format } = router.query;
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    try {
      const params = new URLSearchParams(window.location.search);
      const encodedData = params.get('data');

      if (!encodedData) {
        setError('No data provided');
        setIsGenerating(false);
        return;
      }

      const data: ResumeData = JSON.parse(atob(decodeURIComponent(encodedData)));
      setResumeData(data);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error decoding data:', error);
      setError('Failed to decode data');
      setIsGenerating(false);
    }
  }, [router.isReady]);

  const generateDOCX = async (data: ResumeData) => {
    const sections = [];

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

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center p-4">
        {isGenerating ? (
          <>
            <p className="mb-2">Generating your resume...</p>
            <p className="text-sm text-gray-600">The download will start automatically.</p>
          </>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : resumeData && format === 'pdf' ? (
          <BlobProvider document={<ResumePDF data={resumeData} />}>
            {({ url, loading, error: pdfError }) => {
              if (loading) return <p>Generating PDF...</p>;
              if (pdfError) return <p className="text-red-500">Error generating PDF!</p>;
              if (url) {
                const link = document.createElement('a');
                link.href = url;
                link.download = 'resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setTimeout(() => window.close(), 1000);
                return <p>Download started! You can close this window.</p>;
              }
              return null;
            }}
          </BlobProvider>
        ) : resumeData && format === 'docx' ? (
          <div>
            <p>Generating DOCX...</p>
            {(() => {
              generateDOCX(resumeData);
              return null;
            })()}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ResumeDownload;

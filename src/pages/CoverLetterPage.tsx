import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Document, Page, Text, StyleSheet, BlobProvider } from '@react-pdf/renderer';
import { Document as DocxDocument, Paragraph, Packer } from 'docx';
import { BsFiletypePdf } from "react-icons/bs";

interface CoverLetterData {
    content: string;
    jobDetails: {
        title: string;
        company: string;
        location: string;
    };
    clerk_id: string;
    timestamp: string;
}

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 12,
        fontFamily: 'Helvetica',
        lineHeight: 1.5,
    }
});

const CoverLetterPDF = ({ content }: { content: string }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text>{content}</Text>
        </Page>
    </Document>
);

const generateDocx = async (content: string, company: string) => {
    // First split by double line breaks to get major sections
    const sections = content.split('\n\n');

    const paragraphs = sections.map(section => {
        // For each section, check if it contains single line breaks
        if (section.includes('\n')) {
            // Create separate paragraphs for each line in the section
            return section.split('\n').map(line =>
                new Paragraph({
                    text: line.trim(),
                })
            );
        }

        // For sections without line breaks, create a single paragraph
        return new Paragraph({
            text: section.trim(),
            spacing: {
                after: 350,  // More space after complete sections
            }
        });
    });

    const doc = new DocxDocument({
        sections: [{
            properties: {},
            children: paragraphs.flat()
        }]
    });

    // Generate blob
    const blob = await Packer.toBlob(doc);
    return blob;
};

const CoverLetterPage = () => {
    const [isGenerating, setIsGenerating] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [coverLetterData, setCoverLetterData] = useState<CoverLetterData | null>(null);
    const [format, setFormat] = useState<'pdf' | 'docx' | null>(null);

    // First effect to parse URL parameters and set initial state
    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const encodedData = params.get('data');
            const formatParam = params.get('format') as 'pdf' | 'docx' | null;

            if (!encodedData) {
                setError('No data provided');
                setIsGenerating(false);
                return;
            }

            const data: CoverLetterData = JSON.parse(atob(decodeURIComponent(encodedData)));
            setCoverLetterData(data);
            setFormat(formatParam);
            setIsGenerating(false);
        } catch (error) {
            console.error('Error decoding data:', error);
            setError('Failed to decode data');
            setIsGenerating(false);
        }
    }, []);

    // Effect to handle DOCX generation
    useEffect(() => {
        if (!coverLetterData || format !== 'docx') return;

        const generateAndDownloadDocx = async () => {
            try {
                const blob = await generateDocx(coverLetterData.content, coverLetterData.jobDetails.company);
                const downloadUrl = window.URL.createObjectURL(blob);
                const fileName = `Cover_Letter_${coverLetterData.jobDetails.company}.docx`;

                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(downloadUrl);

                // Close the tab after download starts
                setTimeout(() => window.close(), 200);
            } catch (error) {
                console.error('Error generating DOCX:', error);
                setError('Failed to generate DOCX');
            }
        };

        generateAndDownloadDocx();
    }, [coverLetterData, format]);

    // Effect to handle PDF generation
    useEffect(() => {
        if (!coverLetterData || format !== 'pdf') return;

        const container = document.createElement('div');
        document.body.appendChild(container);
        const root = createRoot(container);

        const pdfDocument = <CoverLetterPDF content={coverLetterData.content} />;
        root.render(
            <BlobProvider document={pdfDocument}>
                {({ loading, blob, url, error: pdfError }) => {
                    if (pdfError) {
                        setError('Failed to generate PDF');
                        return null;
                    }

                    if (!loading && url) {
                        const fileName = `Cover_Letter_${coverLetterData.jobDetails.company}.pdf`;

                        // Use setTimeout to ensure the PDF is fully generated
                        setTimeout(() => {
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = fileName;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);

                            // Close the tab after download starts
                            setTimeout(() => {
                                window.close();
                            }, 500);
                        }, 100);
                    }
                    return null;
                }}
            </BlobProvider>
        );

        return () => {
            root.unmount();
            document.body.removeChild(container);
        };
    }, [coverLetterData, format]);

    if (isGenerating) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="container mx-auto p-4">
                    <div className="text-center p-4">
                        <p className="mb-2">Generating your cover letter...</p>
                        <p className="text-sm text-gray-600">The download will start automatically.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="container mx-auto p-4">
                    <p className="text-red-500 text-center">{error}</p>
                </div>
            </div>
        );
    }

    return null;
};

export default CoverLetterPage;
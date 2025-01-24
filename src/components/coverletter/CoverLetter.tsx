import { useEffect, useState } from 'react';
import { Document, Page, Text, StyleSheet, BlobProvider } from '@react-pdf/renderer';
import { Document as DocxDocument, Paragraph, Packer } from 'docx';
import { fonts } from './fonts';

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
        fontFamily: fonts.arial,
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
            // Flatten the array since some sections return multiple paragraphs
            children: paragraphs.flat()
        }]
    });

    // Generate blob
    const blob = await Packer.toBlob(doc);

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cover_Letter_${company}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

export const CoverLetter = () => {
    const [isGenerating, setIsGenerating] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [coverLetterData, setCoverLetterData] = useState<CoverLetterData | null>(null);
    const [format, setFormat] = useState<'pdf' | 'docx'>('pdf');
    const [docxGenerated, setDocxGenerated] = useState(false);

    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const encodedData = params.get('data');
            const fileFormat = params.get('format') as 'pdf' | 'docx';

            if (!encodedData) {
                setError('No data provided');
                setIsGenerating(false);
                return;
            }

            const data: CoverLetterData = JSON.parse(atob(decodeURIComponent(encodedData)));
            setCoverLetterData(data);
            setFormat(fileFormat || 'pdf');
            setIsGenerating(false);
        } catch (error) {
            console.error('Error decoding data:', error);
            setError('Failed to decode data');
            setIsGenerating(false);
        }
    }, []);

    useEffect(() => {
        if (coverLetterData && !isGenerating && format === 'docx') {
            generateDocx(coverLetterData.content, coverLetterData.jobDetails.company)
                .then(() => {
                    setDocxGenerated(true);
                })
                .catch((error) => {
                    console.error('Error generating DOCX:', error);
                    setError('Failed to generate DOCX');
                });
        }
    }, [coverLetterData, isGenerating, format]);

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center p-4">
                {isGenerating ? (
                    <>
                        <p className="mb-2">Generating your cover letter...</p>
                        <p className="text-sm text-gray-600">The download will start automatically.</p>
                    </>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : coverLetterData && format === 'pdf' ? (
                    <BlobProvider document={<CoverLetterPDF content={coverLetterData.content} />}>
                        {({ url, loading, error: pdfError }) => {
                            if (loading) {
                                return <p>Generating PDF...</p>;
                            }

                            if (pdfError) {
                                return <p className="text-red-500">Error generating PDF!</p>;
                            }

                            if (url) {
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `Cover_Letter_${coverLetterData.jobDetails.company}.pdf`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                return <p>Download started! You can close this window.</p>;
                            }
                            return null;
                        }}
                    </BlobProvider>
                ) : docxGenerated ? (
                    <p>Download started! You can close this window.</p>
                ) : (
                    <p>Generating DOCX...</p>
                )}
            </div>
        </div>
    );
}; 
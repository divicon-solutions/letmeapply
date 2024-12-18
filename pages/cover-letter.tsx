import React, { useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { useRouter } from 'next/router';
import { Document, Packer, Paragraph, TextRun } from 'docx';

const CoverLetter = () => {
  const router = useRouter();
  const { file } = router.query;

  const convertHtmlToDocxContent = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const paragraphs: Paragraph[] = [];

    // Convert HTML elements to DOCX paragraphs
    doc.body.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const text = element.textContent || '';

        if (element.tagName === 'B') {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text,
                  bold: true,
                }),
              ],
            })
          );
        } else if (element.tagName === 'P') {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: text.replace(/\n/g, ' '),
                }),
              ],
              spacing: {
                after: 300,
              },
            })
          );
        }
      }
    });

    return paragraphs;
  };

  useEffect(() => {
    if (!router.isReady) return;

    const generateDocument = async () => {
      try {
        // Fetch HTML content from API
        const response = await fetch('/api/cover-letter');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch cover letter content');
        // }
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
<title>Cover Letter</title>
</head>
<body>
    <p>Charles Bloomberg</p>
    <p>New York City, United States<br>May 12, 2021<br>charlesbloomberg@gmail.com</p>
    <p>Google<br>Dear Hiring team</p>
    <p>My name is XYZ and I am applying for a Web Designer position at Google. I have chosen to apply for this position because
    of your strong reputation for excellence. I’ve developed a strong interest in the Internet, technology, and how people
    interact with each other and their devices. I’ve shown the ability to solve business problems in an innovative manner and
    I am excited to bring my experience to Google.</p>
    <p>My interest in the field of Web Design and the Internet started while I was completing an internship at Ginkgo Bioworks
    where I was able to design and optimize the design of a new service model for a client. I was exposed to how the design of
    a service model, specifically a set of data-driven and user-centric testing service models, is key to understanding your
    client’s business needs and meeting their expectations. I worked closely with the product marketing and customer
    delivery teams to develop a new service model which enabled E2E testing. This experience helped me learn how to design
    and implement a UX testing plan on new service concepts, using customer feedback to further optimize client needs.</p>
    <p>I am excited to apply my knowledge and experiences to the field of Web Design at Google. I am eager to explore new ways
    for users to interact with devices and each other, especially considering how difficult it can be to find the most effective
    way to communicate. I am sure that my interest and experience will provide me with a unique perspective to help you
    grow the field.</p>
    <p>Thank you for your time and consideration. I look forward to discussing the opportunity further.</p>
    <p>Sincerely,</p>
    <p>Charles Bloomberg</p>
</body>
</html>
`;

        const container = document.createElement('div');
        container.innerHTML = htmlContent;
        document.body.appendChild(container);

        switch (file) {
          case 'pdf':
            const doc = new jsPDF({
              unit: 'pt',
              format: 'letter',
              hotfixes: ['px_scaling']
            });

            doc.html(container, {
              callback: function (doc) {
                doc.save('cover-letter.pdf');
                document.body.removeChild(container);
                window.close();
              },
              margin: [40, 40, 40, 40],
              autoPaging: 'text',
              x: 0,
              y: 0,
              width: 535,
              windowWidth: 800
            });
            break;

          case 'docx':
            const paragraphs = convertHtmlToDocxContent(container.innerHTML);

            const doc2 = new Document({
              sections: [{
                properties: {},
                children: paragraphs
              }],
            });

            // Generate and download the DOCX file
            const blob = await Packer.toBlob(doc2);
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'cover-letter.docx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(container);
            window.close();
            break;

          default:
            document.body.removeChild(container);
            router.push('/');
            break;
        }

      } catch (error) {
        console.error('Error generating document:', error);
        window.close();
      }
    };

    generateDocument();
  }, [router.isReady, file, router]);

  return <></>;
};

export default CoverLetter;
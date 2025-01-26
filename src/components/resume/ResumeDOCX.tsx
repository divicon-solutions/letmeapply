import React from 'react';
import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  ISectionOptions,
  TabStopType,
  convertInchesToTwip,
  ExternalHyperlink,
} from "docx";
import { ResumeData } from "../../types/resume";

interface ResumeDOCXProps {
  data: ResumeData;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const formatUrl = (url: string) => {
  if (!url) return url;
  return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
};

const ResumeDOCX: React.FC<ResumeDOCXProps> = () => {
  return null; // Component doesn't need to render anything
};

export const generateResumeDOCX = (data: ResumeData): Document => {
  const sections: Paragraph[] = [];

  // Header
  sections.push(
    new Paragraph({
      children: [
        new TextRun({ text: data.personalInfo.name, bold: true, size: 28 }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun(
          `${data.personalInfo.email} | ${data.personalInfo.phoneNumber}`
        ),
        ...(data.personalInfo.location
          ? [new TextRun(` | ${data.personalInfo.location}`)]
          : []),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  if (data.personalInfo.linkedin || data.personalInfo.githubUrl) {
    sections.push(
      new Paragraph({
        children: [
          ...(data.personalInfo.linkedin
            ? [new ExternalHyperlink({
              children: [
                new TextRun({
                  text: data.personalInfo.linkedin,
                  color: "0000FF",
                  underline: {
                    type: "single",
                    color: "0000FF"
                  }
                })
              ],
              link: formatUrl(data.personalInfo.linkedin)
            })]
            : []),
          ...(data.personalInfo.linkedin && data.personalInfo.githubUrl
            ? [new TextRun(" | ")]
            : []),
          ...(data.personalInfo.githubUrl
            ? [new ExternalHyperlink({
              children: [
                new TextRun({
                  text: data.personalInfo.githubUrl,
                  color: "0000FF",
                  underline: {
                    type: "single",
                    color: "0000FF"
                  }
                })
              ],
              link: formatUrl(data.personalInfo.githubUrl)
            })]
            : []),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );
  }

  // Summary
  if (data.summary) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: "SUMMARY", color: "000000" })],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: data.summary,
        spacing: { after: 400 },
      })
    );
  }

  // Education
  if (data.education?.length) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: "EDUCATION", color: "000000" })],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      })
    );

    data.education.forEach((edu) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.organization, bold: true }),
            new TextRun({ text: "\t" }),
            new TextRun({ text: edu.location || "" }),
          ],
          spacing: { after: 100 },
          tabStops: [
            { type: TabStopType.RIGHT, position: convertInchesToTwip(7.5) },
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: edu.accreditation }),
            new TextRun({ text: "\t" }),
            new TextRun(
              `${formatDate(edu.dates.startDate)} - ${edu.dates.isCurrent
                ? "Present"
                : formatDate(edu.dates.completionDate || "")
              }`
            ),
          ],
          spacing: { after: 200 },
          tabStops: [
            { type: TabStopType.RIGHT, position: convertInchesToTwip(7.5) },
          ],
        })
      );

      edu.achievements?.forEach((achievement) => {
        sections.push(
          new Paragraph({
            text: `• ${achievement}`,
            spacing: { after: 100 },
          })
        );
      });
    });
  }

  // Work Experience
  if (data.workExperience?.length) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: "WORK EXPERIENCE", color: "000000" })],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      })
    );

    data.workExperience.forEach((job) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: job.organization, bold: true }),
            new TextRun({ text: "\t" }),
            new TextRun({ text: job.location || "" }),
          ],
          spacing: { after: 100 },
          tabStops: [
            { type: TabStopType.RIGHT, position: convertInchesToTwip(7.5) },
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: job.jobTitle, bold: true }),
            new TextRun({ text: "\t" }),
            new TextRun(
              `${formatDate(job.dates.startDate)} - ${job.dates.isCurrent
                ? "Present"
                : formatDate(job.dates.completionDate || "")
              }`
            ),
          ],
          spacing: { after: 200 },
          tabStops: [
            { type: TabStopType.RIGHT, position: convertInchesToTwip(7.5) },
          ],
        })
      );

      job.bulletPoints?.forEach((point) => {
        sections.push(
          new Paragraph({
            text: `• ${point}`,
            spacing: { after: 100 },
          })
        );
      });
    });
  }

  // Skills
  if (data.skills && Object.keys(data.skills).length > 0) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: "SKILLS", color: "000000" })],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      })
    );

    Object.entries(data.skills).forEach(([category, skills]) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${category}: `, bold: true }),
            new TextRun(skills.join(", ")),
          ],
          spacing: { after: 200 },
        })
      );
    });
  }

  // Projects
  if (data.projects?.length) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: "PROJECTS", color: "000000" })],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      })
    );

    data.projects.forEach((project) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: project.projectName, bold: true }),
            ...(project.organization
              ? [new TextRun(` - ${project.organization}`)]
              : []),
            ...(project.dates?.startDate
              ? [
                new TextRun({ text: "\t" }),
                new TextRun(
                  `${formatDate(project.dates.startDate)}${project.dates.completionDate
                    ? ` - ${formatDate(project.dates.completionDate)}`
                    : ""
                  }`
                )
              ]
              : []),
          ],
          spacing: { after: 100 },
          tabStops: [
            { type: TabStopType.RIGHT, position: convertInchesToTwip(7.5) },
          ],
        })
      );

      project.bulletPoints?.forEach((point) => {
        sections.push(
          new Paragraph({
            text: `• ${point}`,
            spacing: { after: 100 },
          })
        );
      });
    });
  }

  // Certifications
  if (data.certifications?.length) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: "CERTIFICATIONS", color: "000000" })],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      })
    );

    data.certifications.forEach((cert) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true }),
            ...(cert.description
              ? [
                new TextRun({ text: ": " }),
                new TextRun({ text: cert.description }),
              ]
              : []),
          ],
          spacing: { after: 200 },
        })
      );
    });
  }

  // Publications
  if (data.publications?.length) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: "PUBLICATIONS", color: "000000" })],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      })
    );

    data.publications.forEach((pub) => {
      sections.push(
        new Paragraph({
          children: [new TextRun({ text: pub.title, bold: true })],
          spacing: { after: 100 },
        })
      );

      if (pub.authors?.length) {
        sections.push(
          new Paragraph({
            text: `Authors: ${pub.authors.join(", ")}`,
            spacing: { after: 100 },
          })
        );
      }

      if (pub.description) {
        sections.push(
          new Paragraph({
            text: pub.description,
            spacing: { after: 200 },
          })
        );
      }
    });
  }

  // Languages
  if (data.languages?.length) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: "LANGUAGES", color: "000000" })],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      })
    );

    data.languages.forEach((lang) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: lang.name, bold: true }),
            ...(lang.description
              ? [new TextRun(` - ${lang.description}`)]
              : []),
          ],
          spacing: { after: 100 },
        })
      );
    });
  }

  const documentOptions: ISectionOptions = {
    properties: {
      page: {
        margin: {
          top: convertInchesToTwip(0.5),
          right: convertInchesToTwip(0.5),
          bottom: convertInchesToTwip(0.5),
          left: convertInchesToTwip(0.5),
        },
      },
    },
    children: sections,
  };

  return new Document({
    sections: [documentOptions],
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          run: {
            size: 22,
            font: "Garamond"
          },
          paragraph: {
            spacing: {
              before: 100,
              after: 100,
            },
          },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          run: {
            size: 24,
            bold: true,
            font: "Garamond"
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120
            }
          }
        }
      ],
    },
  });
};

export default ResumeDOCX; 
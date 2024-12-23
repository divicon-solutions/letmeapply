import React, { useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { useRouter } from 'next/router';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, spacing } from 'docx';
import { useAuth, useUser } from '@clerk/nextjs';

const ResumeDownload = () => {
  const router = useRouter();
  const { file } = router.query;
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();

  const generatePDF = (data: any, container: HTMLElement) => {
    const doc = new jsPDF({
      unit: 'pt',
      format: 'letter',
      hotfixes: ['px_scaling']
    });

    const styles = `
      .resume-container { 
        font-family: 'Helvetica', Arial, sans-serif; 
        padding: 40px;
        max-width: 800px;
        margin: 0 auto;
        line-height: 1.5;
      }
      h1 { 
        font-size: 28px; 
        text-align: center; 
        margin-bottom: 5px;
        color: #2c3e50;
        text-transform: uppercase;
        letter-spacing: 2px;
      }
      .contact-info { 
        text-align: center; 
        margin-bottom: 25px;
        font-size: 12px;
        color: #34495e;
      }
      .section-title { 
        font-size: 16px; 
        font-weight: bold; 
        margin-top: 20px;
        margin-bottom: 15px; 
        border-bottom: 2px solid #3498db;
        color: #2c3e50;
        text-transform: uppercase;
        padding-bottom: 5px;
        letter-spacing: 1px;
      }
      .experience-item { 
        margin-bottom: 20px;
        page-break-inside: avoid;
      }
      .job-title { 
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 5px;
        font-size: 14px;
      }
      .company-name { 
        font-style: italic;
        color: #7f8c8d;
        font-size: 13px;
        margin-bottom: 8px;
      }
      .date-range { 
        float: right;
        color: #7f8c8d;
        font-size: 12px;
      }
      .bullet-points { 
        margin-left: 20px;
        margin-top: 8px;
        padding-left: 0;
      }
      .bullet-points li {
        margin-bottom: 5px;
        font-size: 12px;
        color: #2c3e50;
        line-height: 1.4;
      }
      .skill-category { 
        margin-bottom: 12px;
        font-size: 12px;
      }
      .skill-category strong {
        color: #2c3e50;
      }
      .location { 
        color: #7f8c8d;
        font-size: 12px;
        font-style: normal;
      }
      .divider {
        border-top: 1px solid #ecf0f1;
        margin: 15px 0;
      }
      .publication-authors {
        font-size: 11px;
        color: #7f8c8d;
        margin-top: 3px;
      }
      .cert-description {
        font-size: 12px;
        color: #7f8c8d;
        margin-top: 3px;
      }
    `;

    const content = `
      <div class="resume-container">
        <h1>${data.personal_info.name}</h1>
        <div class="contact-info">
          ${data.personal_info.email} | ${data.personal_info.phone}<br/>
          ${data.personal_info.location}<br/>
          <a href="${data.personal_info.linkedin_url}" style="color: #3498db; text-decoration: none;">${data.personal_info.linkedin_url}</a> | 
          <a href="${data.personal_info.github_url}" style="color: #3498db; text-decoration: none;">${data.personal_info.github_url}</a>
        </div>

        <div class="section-title">Professional Summary</div>
        <div style="font-size: 12px; color: #2c3e50; line-height: 1.6;">${data.summary}</div>

        <div class="section-title">Professional Experience</div>
        ${data.work_experience.map((exp: any) => `
          <div class="experience-item">
            <div class="job-title">
              ${exp.job_title}
              <span class="date-range">
                ${new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                ${exp.is_current ? 'Present' : new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div class="company-name">${exp.company_name} <span class="location">• ${exp.location}</span></div>
            <ul class="bullet-points">
              ${exp.bullet_points.map((point: string) => `<li>${point}</li>`).join('')}
            </ul>
          </div>
        `).join('')}

        <div class="section-title">Education</div>
        ${data.education.map((edu: any) => `
          <div class="experience-item">
            <div class="job-title">
              ${edu.school_name}
              <span class="date-range">
                ${new Date(edu.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                ${edu.is_current ? 'Present' : new Date(edu.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div class="company-name">${edu.degree}</div>
            <div class="location">${edu.location}</div>
          </div>
        `).join('')}

        <div class="section-title">Technical Skills</div>
        ${data.skills.map((category: any) => `
          <div class="skill-category">
            <strong>${category.category}:</strong> ${category.skills.join(' • ')}
          </div>
        `).join('')}

        <div class="section-title">Projects</div>
        ${data.projects.map((project: any) => `
          <div class="experience-item">
            <div class="job-title">
              ${project.project_name}
              <span class="date-range">${project.start_date} - ${project.is_current ? 'Present' : ''}</span>
            </div>
            <div class="company-name">${project.organization} <span class="location">• ${project.location}</span></div>
            <ul class="bullet-points">
              ${project.bullet_points.map((point: string) => `<li>${point}</li>`).join('')}
            </ul>
          </div>
        `).join('')}

        <div class="divider"></div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <div class="section-title">Certifications</div>
            ${data.certifications.map((cert: any) => `
              <div class="experience-item">
                <div class="job-title">${cert.name}</div>
                <div class="cert-description">${cert.description}</div>
              </div>
            `).join('')}

            <div class="section-title">Languages</div>
            ${data.languages.map((language: any) => `
              <div class="experience-item">
                <div class="job-title">${language.name}</div>
                <div class="cert-description">${language.description}</div>
              </div>
            `).join('')}
          </div>

          <div>
            <div class="section-title">Achievements</div>
            ${data.achievements.map((achievement: any) => `
              <div class="experience-item">
                <div class="job-title">${achievement.name}</div>
                <div class="cert-description">${achievement.description}</div>
              </div>
            `).join('')}

            <div class="section-title">Publications</div>
            ${data.publications.map((pub: any) => `
              <div class="experience-item">
                <div class="job-title">${pub.title}</div>
                <div class="cert-description">${pub.description}</div>
                <div class="publication-authors">Authors: ${pub.authors.join(', ')}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = `<style>${styles}</style>${content}`;

    doc.html(container, {
      callback: function (doc) {
        doc.save('resume.pdf');
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
  };

  const generateDOCX = async (data: any) => {
    const sections = [];

    // Header section with location
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: data.personal_info.name, bold: true, size: 32 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun(`${data.personal_info.email} | ${data.personal_info.phone}\n`),
          new TextRun(`${data.personal_info.location}\n`),
          new TextRun(`${data.personal_info.linkedin_url} | ${data.personal_info.github_url}`)
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    );

    // Summary section
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

    // Experience section
    sections.push(
      new Paragraph({
        text: "EXPERIENCE",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      })
    );

    data.work_experience.forEach((exp: any) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.job_title, bold: true }),
            new TextRun({ text: ` at ${exp.company_name}` }),
            new TextRun({
              text: `  ${new Date(exp.start_date).getFullYear()} - ${exp.is_current ? 'Present' : new Date(exp.end_date).getFullYear()}`,
              bold: true
            })
          ],
          spacing: { after: 200 }
        })
      );

      exp.bullet_points.forEach((point: string) => {
        sections.push(
          new Paragraph({
            text: `• ${point}`,
            spacing: { after: 100 }
          })
        );
      });
    });

    // Skills section
    sections.push(
      new Paragraph({
        text: "SKILLS",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      })
    );

    data.skills.forEach((category: any) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${category.category}: `, bold: true }),
            new TextRun(category.skills.join(', '))
          ],
          spacing: { after: 200 }
        })
      );
    });

    // Projects section
    sections.push(
      new Paragraph({
        text: "PROJECTS",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      })
    );

    data.projects.forEach((project: any) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: project.project_name, bold: true }),
            new TextRun({ text: ` at ${project.organization} (${project.location})` }),
            new TextRun({
              text: `  ${project.start_date} - ${project.is_current ? 'Present' : ''}`,
              bold: true
            })
          ],
          spacing: { after: 200 }
        })
      );

      project.bullet_points.forEach((point: string) => {
        sections.push(
          new Paragraph({
            text: `• ${point}`,
            spacing: { after: 100 }
          })
        );
      });
    });

    // Certifications section
    sections.push(
      new Paragraph({
        text: "CERTIFICATIONS",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      })
    );

    data.certifications.forEach((cert: any) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true }),
            new TextRun(` - ${cert.description}`)
          ],
          spacing: { after: 200 }
        })
      );
    });

    // Achievements section
    sections.push(
      new Paragraph({
        text: "ACHIEVEMENTS",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      })
    );

    data.achievements.forEach((achievement: any) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: achievement.name, bold: true }),
            new TextRun(` - ${achievement.description}`)
          ],
          spacing: { after: 200 }
        })
      );
    });

    // Languages section
    sections.push(
      new Paragraph({
        text: "LANGUAGES",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      })
    );

    data.languages.forEach((language: any) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: language.name, bold: true }),
            new TextRun(` - ${language.description}`)
          ],
          spacing: { after: 200 }
        })
      );
    });

    // Publications section
    sections.push(
      new Paragraph({
        text: "PUBLICATIONS",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      })
    );

    data.publications.forEach((pub: any) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: pub.title, bold: true }),
            new TextRun(`\n${pub.description}\n`),
            new TextRun(`Authors: ${pub.authors.join(', ')}`)
          ],
          spacing: { after: 200 }
        })
      );
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children: sections
      }]
    });

    const blob = await Packer.toBlob(doc);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'resume.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    window.close();
  };

  useEffect(() => {
    if (!router.isReady || !isLoaded) return;

    if (!user) {
      console.error('No user found');
      router.push('/login');
      return;
    }

    const generateDocument = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error('No token available');
          return;
        }

        const response = await fetch(`http://localhost:8000/api/v1/profiles/clerk/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.resume) {
          throw new Error('No resume data found');
        }

        const container = document.createElement('div');
        document.body.appendChild(container);

        switch (file) {
          case 'pdf':
            generatePDF(data.resume, container);
            break;

          case 'docx':
            await generateDOCX(data.resume);
            document.body.removeChild(container);
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
  }, [router.isReady, file, router, user, isLoaded, getToken]);

  if (!isLoaded || !user) {
    return <div>Loading...</div>;
  }

  return <></>;
};

export default ResumeDownload;

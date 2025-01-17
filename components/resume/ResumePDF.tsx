import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

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

interface ResumePDFProps {
    data: ResumeData;
}

const styles = StyleSheet.create({
    page: { padding: 30 },
    header: { textAlign: "center", marginBottom: 10 },
    name: { fontSize: 18, fontWeight: "bold" },
    contact: { fontSize: 10, marginTop: 4 },
    section: { marginBottom: 20 },
    sectionHeader: {
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 4,
        textTransform: "uppercase",
    },
    sectionDivider: {
        marginVertical: 4,
        borderBottom: "1px solid #000",
        width: "100%",
    },
    subHeader: { fontSize: 10, fontWeight: "bold", marginBottom: 4 },
    jobTitle: { fontSize: 10, fontWeight: "bold" },
    organization: { fontSize: 10, fontStyle: "italic" },
    dates: { fontSize: 10, marginBottom: 4 },
    text: { fontSize: 10, lineHeight: 1.5 },
    bullet: { fontSize: 10, marginLeft: 12, marginBottom: 3 },
    link: { fontSize: 10, color: "blue", textDecoration: "underline" },
});

const ResumePDF: React.FC<ResumePDFProps> = ({ data }) => {
    const { personalInfo, summary, education = [], workExperience = [], skills, projects = [] } = data;

    return (
        <Document>
            <Page style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{personalInfo.name}</Text>
                    <Text style={styles.contact}>
                        {personalInfo.email} | {personalInfo.phoneNumber}
                    </Text>
                    {personalInfo.linkedin && (
                        <Text style={styles.contact}>
                            LinkedIn: <Link src={personalInfo.linkedin} style={styles.link}>{personalInfo.linkedin}</Link>
                        </Text>
                    )}
                </View>

                {/* Summary */}
                {summary && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Summary</Text>
                        <View style={styles.sectionDivider} />
                        <Text style={styles.text}>{summary}</Text>
                    </View>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Education</Text>
                        <View style={styles.sectionDivider} />
                        {education.map((edu, idx: number) => (
                            <View key={idx}>
                                <Text style={styles.subHeader}>
                                    {edu.accreditation}, {edu.organization}
                                </Text>
                                <Text style={styles.dates}>
                                    ({edu.dates.startDate} - {edu.dates.isCurrent ? "Present" : edu.dates.completionDate})
                                </Text>
                                <Text style={styles.text}>{edu.location}</Text>
                                {edu.achievements?.map((ach: string, i: number) => (
                                    <Text key={i} style={styles.bullet}>• {ach}</Text>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* Work Experience */}
                {workExperience.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Work Experience</Text>
                        <View style={styles.sectionDivider} />
                        {workExperience.map((job, idx: number) => (
                            <View key={idx} style={{ marginBottom: 10 }}>
                                <Text style={styles.subHeader}>{job.jobTitle}</Text>
                                <Text style={styles.organization}>{job.organization}</Text>
                                <Text style={styles.dates}>
                                    ({job.dates.startDate} - {job.dates.isCurrent ? "Present" : job.dates.completionDate})
                                </Text>
                                {job.bulletPoints?.map((point: string, i: number) => (
                                    <Text key={i} style={styles.bullet}>• {point}</Text>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                {skills && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Skills</Text>
                        <View style={styles.sectionDivider} />
                        {Object.entries(skills).map(([category, skillList]: [string, string[]], idx: number) => (
                            <View key={idx}>
                                <Text style={styles.subHeader}>{category}:</Text>
                                <Text style={styles.text}>{skillList.join(", ")}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Projects</Text>
                        <View style={styles.sectionDivider} />
                        {projects.map((project, idx: number) => (
                            <View key={idx}>
                                <Text style={styles.subHeader}>{project.name}</Text>
                                {project.bulletPoints?.map((point: string, i: number) => (
                                    <Text key={i} style={styles.bullet}>• {point}</Text>
                                ))}
                            </View>
                        ))}
                    </View>
                )}
            </Page>
        </Document>
    );
};

export default ResumePDF; 
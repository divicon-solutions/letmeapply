import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { ResumeData } from '../../types/resume';
import { fonts } from './fonts';

interface ResumePDFProps {
    data: ResumeData;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const styles = StyleSheet.create({
    page: { padding: 30, fontFamily: fonts.crimsonText },
    header: { textAlign: "center", marginBottom: 10 },
    name: { fontSize: 18, fontFamily: fonts.crimsonText, fontWeight: "bold" },
    contact: { fontSize: 10, marginTop: 4, fontFamily: fonts.crimsonText },
    section: { marginBottom: 8 },
    sectionHeader: {
        fontSize: 12,
        marginBottom: 2,
        textTransform: "uppercase",
        fontFamily: fonts.crimsonText,
        fontWeight: "bold",
        fontStyle: "normal"
    },
    sectionDivider: {
        marginTop: 0,
        marginBottom: 8,
        borderBottom: "0.5px solid #000",
        width: "100%",
    },
    subHeader: {
        fontSize: 10,
        marginBottom: 4,
        fontFamily: fonts.crimsonText,
        fontWeight: "bold"
    },
    jobTitle: { fontSize: 10, fontFamily: fonts.crimsonText },
    organization: {
        fontSize: 10,
        fontFamily: fonts.crimsonText,
        fontWeight: "bold"
    },
    dates: { fontSize: 10, marginBottom: 4, fontFamily: fonts.crimsonText },
    text: { fontSize: 10, lineHeight: 1.5, fontFamily: fonts.crimsonText },
    bullet: { fontSize: 10, marginLeft: 6, marginBottom: 3, fontFamily: fonts.crimsonText },
    link: { fontSize: 10, color: "blue", textDecoration: "underline", fontFamily: fonts.crimsonText },
    educationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    leftContent: {
        flex: 1,
    },
    rightContent: {
        textAlign: 'right',
    },
    skillCategory: {
        marginBottom: 4,
    },
    categoryLabel: {
        fontSize: 10,
        fontWeight: 700,
        fontFamily: fonts.crimsonText
    },
    skillList: {
        fontSize: 10,
        fontFamily: fonts.crimsonText
    },
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
                            <View key={idx} style={{ marginBottom: 8 }}>
                                <View style={styles.educationRow}>
                                    <Text style={[styles.subHeader, styles.leftContent]}>
                                        {edu.organization}
                                    </Text>
                                    <Text style={[styles.text, styles.rightContent]}>
                                        {edu.location}
                                    </Text>
                                </View>
                                <View style={styles.educationRow}>
                                    <Text style={[styles.text, styles.leftContent]}>
                                        {edu.accreditation}
                                    </Text>
                                    <Text style={[styles.text, styles.rightContent]}>
                                        {formatDate(edu.dates.startDate)} - {edu.dates.isCurrent ? "Present" : formatDate(edu.dates.completionDate || '')}
                                    </Text>
                                </View>
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
                            <View key={idx} style={{ marginBottom: idx === workExperience.length - 1 ? 0 : 6 }}>
                                <View style={styles.educationRow}>
                                    <Text style={[styles.subHeader, styles.leftContent]}>
                                        {job.organization}
                                    </Text>
                                    <Text style={[styles.text, styles.rightContent]}>
                                        {job.location}
                                    </Text>
                                </View>
                                <View style={styles.educationRow}>
                                    <Text style={[styles.text, styles.leftContent]}>
                                        {job.jobTitle}
                                    </Text>
                                    <Text style={[styles.text, styles.rightContent]}>
                                        {formatDate(job.dates.startDate)} - {job.dates.isCurrent ? "Present" : formatDate(job.dates.completionDate || '')}
                                    </Text>
                                </View>
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
                            <View key={idx} style={styles.skillCategory}>
                                <Text>
                                    <Text style={styles.categoryLabel}>{category}: </Text>
                                    <Text style={styles.skillList}>
                                        {skillList.join(", ")}
                                    </Text>
                                </Text>
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
                            <View key={idx} style={{ marginBottom: idx === projects.length - 1 ? 0 : 6 }}>
                                <View style={styles.educationRow}>
                                    <Text style={[styles.subHeader, styles.leftContent]}>
                                        {project.projectName}
                                    </Text>
                                    {project.dates?.startDate && (
                                        <Text style={[styles.text, styles.rightContent]}>
                                            {formatDate(project.dates.startDate)}
                                            {project.dates.completionDate && ` - ${formatDate(project.dates.completionDate)}`}
                                        </Text>
                                    )}
                                </View>
                                {project.bulletPoints?.map((point: string, i: number) => (
                                    <Text key={i} style={styles.bullet}>• {point}</Text>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* Certifications */}
                {data.certifications && data.certifications.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Certifications</Text>
                        <View style={styles.sectionDivider} />
                        {data.certifications.map((cert, idx: number) => (
                            <View key={idx} style={{ marginBottom: idx === data.certifications!.length - 1 ? 0 : 4 }}>
                                <Text style={styles.subHeader}>{cert.name}</Text>
                                {cert.description && (
                                    <Text style={styles.text}>{cert.description}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Publications */}
                {data.publications && data.publications.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Publications</Text>
                        <View style={styles.sectionDivider} />
                        {data.publications.map((pub, idx: number) => (
                            <View key={idx} style={{ marginBottom: idx === data.publications!.length - 1 ? 0 : 4 }}>
                                <Text style={styles.subHeader}>{pub.title}</Text>
                                {pub.authors && (
                                    <Text style={styles.text}>Authors: {pub.authors.join(", ")}</Text>
                                )}
                                {pub.description && (
                                    <Text style={styles.text}>{pub.description}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Achievements */}
                {data.achievements && data.achievements.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Achievements</Text>
                        <View style={styles.sectionDivider} />
                        {data.achievements.map((achievement, idx: number) => (
                            <View key={idx} style={{ marginBottom: idx === data.achievements!.length - 1 ? 0 : 4 }}>
                                <Text style={styles.subHeader}>{achievement.name}</Text>
                                {achievement.description && (
                                    <Text style={styles.text}>{achievement.description}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Languages */}
                {data.languages && data.languages.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Languages</Text>
                        <View style={styles.sectionDivider} />
                        {data.languages.map((language, idx: number) => (
                            <View key={idx} style={{ marginBottom: idx === data.languages!.length - 1 ? 0 : 4 }}>
                                <View style={styles.educationRow}>
                                    <Text style={[styles.subHeader, styles.leftContent]}>
                                        {language.name}
                                    </Text>
                                    {language.description && (
                                        <Text style={[styles.text, styles.rightContent]}>
                                            {language.description}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </Page>
        </Document>
    );
};

export default ResumePDF; 
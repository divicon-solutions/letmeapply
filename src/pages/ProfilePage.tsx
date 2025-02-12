import React, { useState, useEffect } from 'react';
import { ProfileData } from '../types/profile';
import toast from 'react-hot-toast';
import ResumeUpload from '../components/ResumeUpload';
import { useUser, useAuth } from '@clerk/clerk-react';
import { BASE_API_URL } from '../utils/config';
import { Formik, Form } from 'formik';
import PersonalInfoSection from '../components/profile/PersonalInfoSection';
import EducationSection from '../components/profile/EducationSection';
import WorkExperienceSection from '../components/profile/WorkExperienceSection';
import SkillsSection from '../components/profile/SkillsSection';
import ProjectsSection from '../components/profile/ProjectsSection';
import CertificationsSection from '../components/profile/CertificationsSection';
import AchievementsSection from '../components/profile/AchievementsSection';
import LanguagesSection from '../components/profile/LanguagesSection';
import PublicationsSection from '../components/profile/PublicationsSection';
import ResumeButton from '../components/profile/ResumeButton';
import FixButton from '../components/profile/FixButton';
import FixDialog from '../components/profile/FixDialog';
import { getInvalidFields } from '../components/profile/DateFieldHelper';
import { updateSection, handleChange as apiHandleChange } from '../components/profile/UpdateApi';
import axios from 'axios';

const ProfilePage = () => {
    const { isSignedIn, isLoaded, getToken } = useAuth();
    const { user } = useUser();
    const [initialValues, setInitialValues] = useState<ProfileData | null>(null);
    const [showFixDialog, setShowFixDialog] = useState(false);
    const [dialogOpen, setDialogOpen] = useState({
        education: false,
        workExperience: false,
        projects: false,
        certifications: false,
        achievements: false,
        languages: false,
        publications: false,
        skills: false
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) return;

            try {
                const token = await getToken();
                // First, try to get the existing profile
                const response = await fetch(`${BASE_API_URL}/api/v1/profiles/clerk/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 404) {
                    // Profile doesn't exist, create a new one
                    console.log("User profile not found. Creating new profile...");
                    const createResponse = await fetch(`${BASE_API_URL}/api/v1/profiles`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: user.emailAddresses[0].emailAddress,
                            clerk_id: user.id,
                            resume: {
                                personalInfo: {
                                    name: '',
                                    email: user.emailAddresses[0].emailAddress,
                                    phoneNumber: '',
                                    location: '',
                                    linkedin: '',
                                    githubUrl: '',
                                },
                                summary: '',
                                education: [],
                                workExperience: [],
                                skills: {},
                                projects: [],
                                certifications: [],
                                achievements: [],
                                languages: [],
                                publications: [],
                            }
                        }),
                    });

                    if (createResponse.ok) {
                        const data = await createResponse.json();
                        if (data.resume) {
                            setInitialValues(data.resume);
                            toast.success('New profile created successfully');
                        } else {
                            console.error('Invalid response format:', data);
                            toast.error('Failed to create profile: Invalid format');
                        }
                    } else {
                        console.error('Failed to create profile:', createResponse.statusText);
                        toast.error('Failed to create profile');
                    }
                } else if (response.ok) {
                    // Profile exists, load it
                    const data = await response.json();
                    if (data.resume) {
                        setInitialValues(data.resume);
                    } else {
                        console.error('Invalid response format:', data);
                        toast.error('Failed to load profile data: Invalid format');
                    }
                } else {
                    console.error('Failed to fetch profile:', response.statusText);
                    toast.error('Failed to load profile data');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error('Failed to load profile data');
            }
        };

        if (isSignedIn) {
            fetchProfile();
        }
    }, [user?.id, isSignedIn, getToken]);

    const handleFieldBlur = async (fieldName: string, value: string | boolean, setFieldError: (field: string, message: string | undefined) => void) => {
        if (!user?.id) return;

        try {
            const token = await getToken();
            const sectionName = fieldName.split('.')[0];
            const updatedData = { ...initialValues };
            const fieldPath = fieldName.split('.');
            let current = updatedData;

            // Traverse the object path
            for (let i = 0; i < fieldPath.length - 1; i++) {
                current = current[fieldPath[i]];
            }

            // Set the value at the final path
            current[fieldPath[fieldPath.length - 1]] = value;

            await updateSection(user.id, user.primaryEmailAddress?.emailAddress || '', sectionName, updatedData[sectionName], initialValues!, token);
            setFieldError(fieldName, undefined);
        } catch (error) {
            console.error('Error updating field:', error);
            setFieldError(fieldName, 'Failed to update field');
        }
    };

    const handleChange = async (section: string, newData: unknown) => {
        console.log('handleChange called with section:', section, 'and newData:', newData);
        if (!user?.id) return;

        const payload = {
            email: user?.primaryEmailAddress?.emailAddress,
            clerk_id: user?.id,
            resume: {
                personalInfo: { ...initialValues.personalInfo },
                summary: initialValues.summary,
                education: section === 'education' ? newData : [...initialValues.education],
                workExperience: section === 'workExperience' ? newData : [...initialValues.workExperience],
                skills: section === 'skills' ? newData : { ...initialValues.skills },
                projects: section === 'projects' ? newData : [...initialValues.projects],
                certifications: section === 'certifications' ? newData : [...initialValues.certifications],
                achievements: section === 'achievements' ? newData : [...initialValues.achievements],
                languages: section === 'languages' ? newData : [...initialValues.languages],
                publications: section === 'publications' ? newData : [...initialValues.publications],
            },
        };

        try {
            const response = await axios.post(`${BASE_API_URL}/api/v1/profiles`, payload);
            console.log('API Response:', response.data);
            setInitialValues(response.data.resume);
            if (section !== 'skills') {
                toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully`);
            }
        } catch (error) {
            console.error('Error handling change:', error);
            toast.error('Failed to update section');
        }
    };

    const setFieldValue = (field: string, value: unknown) => {
        const newValues = { ...initialValues };
        const path = field.split('.');
        let current: any = newValues;

        // Traverse the path to the target field
        for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) {
                current[path[i]] = {};
            }
            current = current[path[i]];
        }
        current[path[path.length - 1]] = value;

        setInitialValues(newValues);
    };

    const setFieldError = (field: string, message: string | undefined) => {
        // This function would be implemented if you're using a form management library like Formik
        console.log('Field error:', field, message);
    };

    const openDialog = (type: keyof typeof dialogOpen) => {
        setDialogOpen({ ...dialogOpen, [type]: true });
    };

    const closeDialog = (type: keyof typeof dialogOpen) => {
        setDialogOpen({ ...dialogOpen, [type]: false });
    };

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-2">
            <div className="relative sm:max-w-xl md:max-w-4xl sm:mx-auto">
                {!initialValues?.personalInfo?.name ? (
                    <ResumeUpload onUploadSuccess={setInitialValues} />
                ) : (
                    <Formik
                        initialValues={{
                            ...initialValues,
                            newEducation: {
                                organization: '',
                                accreditation: '',
                                location: '',
                                dates: {
                                    startDate: '',
                                    completionDate: '',
                                    isCurrent: false
                                }
                            },
                            newWorkExperience: {
                                organization: '',
                                jobTitle: '',
                                location: '',
                                dates: {
                                    startDate: '',
                                    completionDate: '',
                                    isCurrent: false
                                },
                                bulletPoints: []
                            },
                            newProject: {
                                projectName: '',
                                organization: '',
                                location: '',
                                dates: {
                                    startDate: '',
                                    completionDate: '',
                                    isCurrent: false
                                },
                                bulletPoints: []
                            },
                            newCertification: {
                                name: '',
                                description: ''
                            },
                            newAchievement: {
                                name: '',
                                description: ''
                            },
                            newLanguage: {
                                name: '',
                                description: ''
                            },
                            newPublication: {
                                title: '',
                                description: '',
                                authors: []
                            },
                            newSkill: {
                                category: '',
                                skills: ''
                            }
                        }}
                        enableReinitialize
                        onSubmit={(values) => {
                            console.log('Form submitted:', values);
                        }}
                    >
                        {({ setFieldError }) => (
                            <Form className="space-y-6">
                                <div className="flex justify-between items-center gap-4">
                                    <ResumeButton onUploadSuccess={setInitialValues} />
                                    <FixButton values={initialValues} onClick={() => setShowFixDialog(true)} />
                                </div>
                                <PersonalInfoSection
                                    values={initialValues}
                                    setFieldError={setFieldError}
                                    handleFieldBlur={handleFieldBlur}
                                />
                                <EducationSection
                                    values={initialValues}
                                    dialogOpen={dialogOpen.education}
                                    setDialogOpen={(open) => setDialogOpen({ ...dialogOpen, education: open })}
                                    handleFieldBlur={handleFieldBlur}
                                    handleChange={handleChange}
                                    setFieldValue={setFieldValue}
                                    setFieldError={setFieldError}
                                />
                                <WorkExperienceSection
                                    values={initialValues}
                                    dialogOpen={dialogOpen.workExperience}
                                    setDialogOpen={(open) => setDialogOpen({ ...dialogOpen, workExperience: open })}
                                    handleFieldBlur={handleFieldBlur}
                                    handleChange={handleChange}
                                    setFieldValue={setFieldValue}
                                    setFieldError={setFieldError}
                                />
                                <SkillsSection
                                    values={initialValues}
                                    dialogOpen={dialogOpen.skills}
                                    setDialogOpen={(open) => setDialogOpen({ ...dialogOpen, skills: open })}
                                    handleChange={handleChange}
                                    setFieldValue={setFieldValue}
                                />
                                <ProjectsSection
                                    values={initialValues}
                                    dialogOpen={dialogOpen.projects}
                                    setDialogOpen={(open) => setDialogOpen({ ...dialogOpen, projects: open })}
                                    handleFieldBlur={handleFieldBlur}
                                    handleChange={handleChange}
                                    setFieldValue={setFieldValue}
                                    setFieldError={setFieldError}
                                />
                                <CertificationsSection
                                    values={initialValues}
                                    dialogOpen={dialogOpen.certifications}
                                    setDialogOpen={(open) => setDialogOpen({ ...dialogOpen, certifications: open })}
                                    handleFieldBlur={handleFieldBlur}
                                    handleChange={handleChange}
                                    setFieldValue={setFieldValue}
                                    setFieldError={setFieldError}
                                />
                                <AchievementsSection
                                    values={initialValues}
                                    dialogOpen={dialogOpen.achievements}
                                    setDialogOpen={(open) => setDialogOpen({ ...dialogOpen, achievements: open })}
                                    handleFieldBlur={handleFieldBlur}
                                    handleChange={handleChange}
                                    setFieldValue={setFieldValue}
                                    setFieldError={setFieldError}
                                />
                                <LanguagesSection
                                    values={initialValues}
                                    dialogOpen={dialogOpen.languages}
                                    setDialogOpen={(open) => setDialogOpen({ ...dialogOpen, languages: open })}
                                    handleFieldBlur={handleFieldBlur}
                                    handleChange={handleChange}
                                    setFieldValue={setFieldValue}
                                    setFieldError={setFieldError}
                                />
                                <PublicationsSection
                                    values={initialValues}
                                    dialogOpen={dialogOpen.publications}
                                    setDialogOpen={(open) => setDialogOpen({ ...dialogOpen, publications: open })}
                                    handleFieldBlur={handleFieldBlur}
                                    handleChange={handleChange}
                                    setFieldValue={setFieldValue}
                                    setFieldError={setFieldError}
                                />
                                <FixDialog
                                    isOpen={showFixDialog}
                                    onClose={() => setShowFixDialog(false)}
                                    invalidFields={getInvalidFields(initialValues)}
                                />
                            </Form>
                        )}
                    </Formik>
                )}
            </div>
        </div>
    );
};

export default ProfilePage; 
import { useState, useEffect } from 'react';
import { ProfileData } from '../types/profile';
import { Formik, Form, Field } from 'formik';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import ResumeUpload from '../components/ResumeUpload';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { BASE_API_URL } from '../utils/config';
import Profile from '../components/Profile';

interface DialogState {
    education: boolean;
    workExperience: boolean;
    projects: boolean;
    certifications: boolean;
    achievements: boolean;
    languages: boolean;
    publications: boolean;
    skills: boolean;
}

const validationSchema = Yup.object().shape({
    personalInfo: Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phoneNumber: Yup.string(),
        location: Yup.string(),
        linkedin: Yup.string().url('Invalid URL'),
        githubUrl: Yup.string().url('Invalid URL'),
    }),
    summary: Yup.string(),
});

const deleteButtonClass = "text-red-500 hover:text-red-700 transition-colors duration-150";
const deleteIconClass = "w-4 h-4";

const ProfilePage = () => {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<ProfileData>({
        personalInfo: {
            name: '',
            email: '',
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
    });

    const [dialogOpen, setDialogOpen] = useState<DialogState>({
        education: false,
        workExperience: false,
        projects: false,
        certifications: false,
        achievements: false,
        languages: false,
        publications: false,
        skills: false,
    });

    useEffect(() => {
        const checkUserExistsAndCreate = async () => {
            if (user) {
                setIsLoading(true);
                const email = user.primaryEmailAddress?.emailAddress;
                const id = user.id;

                try {
                    // Check if user exists
                    const response = await fetch(
                        `${BASE_API_URL}/api/v1/profiles/clerk/${id}`,
                        {
                            method: "GET",
                            credentials: "include",
                        }
                    );

                    if (response.status === 404) {
                        console.log("User does not exist. Creating user...");
                        // User does not exist, create user
                        const createResponse = await fetch(
                            `${BASE_API_URL}/api/v1/profiles`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                credentials: "include",
                                body: JSON.stringify({
                                    email,
                                    clerk_id: id,
                                }),
                            }
                        );

                        if (createResponse.ok) {
                            console.log("User created successfully.");
                            const data = await createResponse.json();
                            setInitialValues(data.resume || initialValues);
                        } else {
                            const createData = await createResponse.json();
                            console.error("Error creating user:", createData.error);
                            toast.error("Failed to create user profile");
                        }
                    } else if (response.ok) {
                        const data = await response.json();
                        console.log("User exists:", data);
                        setInitialValues(data.resume || initialValues);
                    } else {
                        const data = await response.json();
                        console.error("Error:", data.error);
                        toast.error("Failed to fetch user profile");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    toast.error("An error occurred while checking user profile");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        checkUserExistsAndCreate();
    }, [user]);

    const openDialog = (type: keyof DialogState) => {
        setDialogOpen({ ...dialogOpen, [type]: true });
    };

    const closeDialog = (type: keyof DialogState) => {
        setDialogOpen({ ...dialogOpen, [type]: false });
    };

    const handleFieldBlur = async (fieldName: string, value: string, setFieldError: (field: string, message: string | undefined) => void) => {
        // Validation logic here if needed
    };

    const handleDelete = async (sectionName: string, newData: unknown[], sectionType: string) => {
        try {
            const response = await axios.post(`${BASE_API_URL}/api/v1/profiles`, {
                email: user?.primaryEmailAddress?.emailAddress,
                clerk_id: user?.id,
                resume: {
                    ...initialValues,
                    [sectionName]: newData,
                },
            });
            setInitialValues(response.data.resume);
            toast.success(`${sectionType} deleted successfully`);
        } catch (error) {
            console.error('API Error:', error);
            toast.error('Failed to delete section');
        }
    };

    const handleChange = async (section: string, newData: unknown) => {
        console.log('handleChange', section, newData);
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
                toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} Added successfully`);
            }
        } catch (error) {
            console.error('API Error:', error);
            toast.error('Failed to update section');
        }
    };

    const handleResumeData = (data: ProfileData) => {
        setInitialValues(data);
        toast.success('Resume data loaded successfully');
    };

    if (!user || isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-2">
            <div className="relative sm:max-w-xl md:max-w-4xl sm:mx-auto">
                {!initialValues?.personalInfo?.name ? (
                    <ResumeUpload onUploadSuccess={handleResumeData} />
                ) : (
                    <Profile />
                )}
            </div>
        </div>
    );
};

export default ProfilePage; 
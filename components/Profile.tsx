import { useState, useEffect } from 'react';
import { ProfileData } from '@/types/profile';
import { Formik, Form, Field } from 'formik';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import ResumeUpload from './ResumeUpload';
import { useAuth, useUser } from '@clerk/nextjs';
import axios from 'axios';

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

const Profile = () => {
  const { getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await getToken();
        console.log('Auth Token:', token);
      } catch (error) {
        console.error('Error getting token:', error);
      }
    };

    if (user) {
      checkToken();
    }
  }, [user, getToken]);

  const updateSection = async (clerk_id: string, sectionName: string, content: any) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      console.log('Token used for request:', token);

      const requestData = {
        section: sectionName,
        operation: "update",
        content: content
      };

      console.log('Request payload:', JSON.stringify(requestData, null, 2));

      const response = await axios.patch(`http://localhost:8000/api/v1/profiles/clerk/${clerk_id}/resume`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Update local state after successful API call
      setInitialValues(prevValues => ({
        ...prevValues,
        [sectionName]: content
      }));

      console.log('API Response:', response.data);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorDetails = error.response?.data?.detail;
        console.error('Error details:', errorDetails);
        console.error('Full error response:', error.response?.data);
        console.error('Request headers:', error.config?.headers);

        let errorMessage = 'Failed to update section';
        if (Array.isArray(errorDetails)) {
          errorMessage = errorDetails.map(detail => detail.msg || detail).join(', ');
        } else if (errorDetails) {
          errorMessage = errorDetails;
        }

        toast.error(`Failed to update section: ${errorMessage}`);
      } else {
        console.error('Error updating section:', error);
        toast.error('Failed to update section');
      }
      throw error;
    }
  };

  const initialData: ProfileData = {
    personal_info: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin_url: '',
      github_url: ''
    },
    summary: '',
    education: [],
    work_experience: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
    publications: []
  };

  const validationSchema = Yup.object().shape({
    personal_info: Yup.object().shape({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      phone: Yup.string(),
      location: Yup.string(),
      linkedin_url: Yup.string().url('Invalid URL'),
      github_url: Yup.string().url('Invalid URL')
    }),
    summary: Yup.string(),
    education: Yup.array().of(
      Yup.object().shape({
        school_name: Yup.string().required('Institution name is required'),
        degree: Yup.string().required('Degree is required'),
        location: Yup.string(),
        start_date: Yup.string().nullable(),
        end_date: Yup.string().required('End date is required'),
        is_current: Yup.boolean(),
      })
    ),
    work_experience: Yup.array().of(
      Yup.object().shape({
        company_name: Yup.string().required('Company name is required'),
        job_title: Yup.string().required('Job title is required'),
        location: Yup.string(),
        start_date: Yup.string().required('Start date is required'),
        end_date: Yup.string().required('End date is required'),
        is_current: Yup.boolean(),
        bullet_points: Yup.array().of(Yup.string()),
      })
    ),
    skills: Yup.array().of(
      Yup.object().shape({
        category: Yup.string().required('Category is required'),
        skills: Yup.array().of(Yup.string()),
      })
    ),
    certifications: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Certification name is required'),
        description: Yup.string(),
      })
    ),
    projects: Yup.array().of(
      Yup.object().shape({
        project_name: Yup.string().required('Project name is required'),
        organization: Yup.string(),
        location: Yup.string(),
        start_date: Yup.string(),
        end_date: Yup.string(),
        is_current: Yup.boolean(),
        bullet_points: Yup.array().of(Yup.string())
      })
    ),
  });

  const [dialogOpen, setDialogOpen] = useState<DialogState>({
    education: false,
    workExperience: false,
    projects: false,
    certifications: false,
    achievements: false,
    languages: false,
    publications: false,
    skills: false
  });
  const [initialValues, setInitialValues] = useState<ProfileData>({
    personal_info: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin_url: '',
      github_url: ''
    },
    summary: '',
    education: [],
    work_experience: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
    publications: []
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile...');
        const token = await getToken();
        console.log('Got token:', token ? 'Token exists' : 'No token');

        if (!user?.id) {
          console.log('No user ID available yet');
          return;
        }

        const response = await fetch(`http://localhost:8000/api/v1/profiles/clerk/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        console.log('Profile API Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to fetch profile:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
          });
          return;
        }

        const data = await response.json();
        console.log('Profile data received:', data);

        if (data && data.resume) {
          console.log('Setting initial values with resume data');
          setInitialValues(data.resume);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (user?.id) {
      fetchProfile();
    }
  }, [getToken, user?.id]);

  useEffect(() => {
    // console.log('Profile - Current profile data:', JSON.stringify(initialValues, null, 2));
  }, [initialValues]);

  const handleResumeData = async (data: ProfileData) => {
    try {
      setInitialValues(data);
      toast.success('Resume data loaded successfully');
    } catch (error) {
      console.error('Error handling resume data:', error);
      toast.error('Failed to load resume data');
    }
  };

  const openDialog = (type: keyof DialogState) => {
    setDialogOpen({ ...dialogOpen, [type]: true });
  };

  const closeDialog = (type: keyof DialogState) => {
    setDialogOpen({ ...dialogOpen, [type]: false });
  };

  const handleFieldBlur = async (fieldName: string, value: any, setFieldError: (field: string, message: string | undefined) => void) => {
    try {
      if (!user?.id) {
        console.error('User ID not available');
        return;
      }

      const parts = fieldName.split('.');
      const section = parts[0];
      const index = parts.length > 2 ? parseInt(parts[1]) : null;
      const field = parts[parts.length - 1];

      // Get the current section data from initialValues
      const currentSectionData = initialValues[section] || {};

      // Handle different types of sections
      let updatedSectionData;
      if (section === 'summary') {
        // Handle summary as a direct string value
        updatedSectionData = value;
      } else if (Array.isArray(initialValues[section])) {
        // Handle array sections (like education)
        const arrayData = [...initialValues[section]];
        if (index !== null) {
          // Update existing item in array
          arrayData[index] = {
            ...arrayData[index],
            [field]: value
          };
          updatedSectionData = arrayData;
        } else {
          // Add new item to array
          updatedSectionData = arrayData;
        }
      } else if (field) {
        // Handle object sections (like personal_info)
        updatedSectionData = {
          ...currentSectionData,
          [field]: value
        };
      } else {
        // Handle direct value updates
        updatedSectionData = value;
      }

      console.log('Updating section:', section);
      console.log('Field:', field);
      console.log('Value:', value);
      console.log('Updated data:', updatedSectionData);

      await updateSection(user.id, section, updatedSectionData);
      toast.success(`${field || section} updated successfully`);
    } catch (error) {
      console.error('Error updating field:', error);
      toast.error('Failed to update field');
      setFieldError(fieldName, 'Failed to save changes');
    }
  };

  // Render dialog component
  const Dialog = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30"></div>
          <div className="relative bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <FaTimes />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    );
  };

  const deleteButtonClass = "flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors duration-150 p-1 rounded hover:bg-red-50";
  const deleteIconClass = "w-4 h-4";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-2">
      <div className="relative sm:max-w-xl md:max-w-4xl sm:mx-auto">

        {
          !initialValues?.personal_info?.name ?
            <ResumeUpload onUploadSuccess={handleResumeData} />
            :
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              enableReinitialize={true}
              onSubmit={() => { }}
            >
              {({ values, setFieldValue, setFieldError }) => (
                <Form className="space-y-6">
                  <div className="space-y-8">
                    {/* Personal Information */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <Field
                            type="text"
                            name="personal_info.name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter your full name"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('personal_info.name', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <Field
                            type="email"
                            name="personal_info.email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter your email"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('personal_info.email', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone</label>
                          <Field
                            type="text"
                            name="personal_info.phone"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter your phone number"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('personal_info.phone', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Location</label>
                          <Field
                            type="text"
                            name="personal_info.location"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter your location"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('personal_info.location', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                          <Field
                            type="url"
                            name="personal_info.linkedin_url"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter your LinkedIn profile URL"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('personal_info.linkedin_url', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
                          <Field
                            type="url"
                            name="personal_info.github_url"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter your GitHub profile URL"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('personal_info.github_url', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Summary</h2>
                      <Field
                        as="textarea"
                        name="summary"
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                          handleFieldBlur('summary', e.target.value, setFieldError);
                        }}
                      />
                    </div>

                    {/* Education */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => openDialog('education')}
                        >
                          <FaPlus className="mr-2" /> Add Education
                        </button>
                      </div>
                      {values.education.map((edu, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-medium">{edu.school_name}</h3>
                            <button
                              type="button"
                              onClick={() => {
                                const newEducation = [...values.education];
                                newEducation.splice(index, 1);
                                setFieldValue('education', newEducation);
                              }}
                              className={deleteButtonClass}
                            >
                              <FaTrash className={deleteIconClass} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">School Name</label>
                              <Field
                                type="text"
                                name={`education.${index}.school_name`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                  handleFieldBlur(`education.${index}.school_name`, e.target.value, setFieldError);
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Degree</label>
                              <Field
                                type="text"
                                name={`education.${index}.degree`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                  handleFieldBlur(`education.${index}.degree`, e.target.value, setFieldError);
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Location</label>
                              <Field
                                type="text"
                                name={`education.${index}.location`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                  handleFieldBlur(`education.${index}.location`, e.target.value, setFieldError);
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Start Date</label>
                              <Field
                                type="date"
                                name={`education.${index}.start_date`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                  handleFieldBlur(`education.${index}.start_date`, e.target.value, setFieldError);
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">End Date</label>
                              <Field
                                type="date"
                                name={`education.${index}.end_date`}
                                disabled={values.education[index].is_current}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                  handleFieldBlur(`education.${index}.end_date`, e.target.value, setFieldError);
                                }}
                              />
                            </div>
                            <div className="flex items-center mt-6">
                              <Field
                                type="checkbox"
                                name={`education.${index}.is_current`}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                  handleFieldBlur(`education.${index}.is_current`, e.target.checked, setFieldError);
                                }}
                              />
                              <label className="ml-2 block text-sm text-gray-900">Currently Studying</label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Education Dialog */}
                    <Dialog
                      isOpen={dialogOpen.education}
                      onClose={() => closeDialog('education')}
                      title="Add Education"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">School Name</label>
                          <Field
                            type="text"
                            name="newEducation.school_name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('newEducation.school_name', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Degree</label>
                          <Field
                            type="text"
                            name="newEducation.degree"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('newEducation.degree', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Location</label>
                          <Field
                            type="text"
                            name="newEducation.location"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('newEducation.location', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Date</label>
                          <Field
                            type="date"
                            name="newEducation.start_date"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('newEducation.start_date', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">End Date</label>
                          <Field
                            type="date"
                            name="newEducation.end_date"
                            disabled={values.newEducation?.is_current}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('newEducation.end_date', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div className="flex items-center">
                          <Field
                            type="checkbox"
                            name="newEducation.is_current"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('newEducation.is_current', e.target.checked, setFieldError);
                            }}
                          />
                          <label className="ml-2 block text-sm text-gray-900">Currently Studying</label>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="button"
                          className="mt-3 flex-1 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => {
                            const newEducation = values.newEducation;
                            if (newEducation) {
                              setFieldValue('education', [...values.education, { ...newEducation }]);
                              setFieldValue('newEducation', {});
                              closeDialog('education');
                            }
                          }}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => closeDialog('education')}
                        >
                          Cancel
                        </button>
                      </div>
                    </Dialog>

                    {/* Work Experience */}
                    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
                        <button
                          type="button"
                          onClick={() => setDialogOpen({ ...dialogOpen, workExperience: true })}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FaPlus className="mr-2 w-4 h-4" /> Add Work Experience
                        </button>
                      </div>

                      {values.work_experience.map((experience, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4 hover:border-gray-300 transition-colors duration-200">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {experience.job_title} at {experience.company_name}
                            </h3>
                            <button
                              type="button"
                              onClick={() => {
                                const newExperience = [...values.work_experience];
                                newExperience.splice(index, 1);
                                setFieldValue('work_experience', newExperience);
                              }}
                              className={deleteButtonClass}
                            >
                              <FaTrash className={deleteIconClass} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                <Field
                                  type="text"
                                  name={`work_experience.${index}.company_name`}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                  placeholder="Enter company name"
                                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                    handleFieldBlur(`work_experience.${index}.company_name`, e.target.value, setFieldError);
                                  }}
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                <Field
                                  type="text"
                                  name={`work_experience.${index}.job_title`}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                  placeholder="Enter job title"
                                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                    handleFieldBlur(`work_experience.${index}.job_title`, e.target.value, setFieldError);
                                  }}
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                              <Field
                                type="text"
                                name={`work_experience.${index}.location`}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                placeholder="Enter location"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                  handleFieldBlur(`work_experience.${index}.location`, e.target.value, setFieldError);
                                }}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <Field
                                  type="date"
                                  name={`work_experience.${index}.start_date`}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                    handleFieldBlur(`work_experience.${index}.start_date`, e.target.value, setFieldError);
                                  }}
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <Field
                                  type="date"
                                  name={`work_experience.${index}.end_date`}
                                  disabled={experience.is_current}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                    handleFieldBlur(`work_experience.${index}.end_date`, e.target.value, setFieldError);
                                  }}
                                />
                              </div>
                            </div>

                            <div className="flex items-center">
                              <Field
                                type="checkbox"
                                name={`work_experience.${index}.is_current`}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                  handleFieldBlur(`work_experience.${index}.is_current`, e.target.checked, setFieldError);
                                }}
                              />
                              <label className="ml-2 text-sm text-gray-900">Currently Working</label>
                            </div>

                            <div className="space-y-4">
                              <label className="block text-sm font-medium text-gray-700">Bullet Points</label>
                              <div className="space-y-3">
                                {values.work_experience[index].bullet_points?.map((point, idx) => (
                                  <div key={idx} className="flex items-start gap-2">
                                    <Field
                                      as="textarea"
                                      rows={2}
                                      name={`work_experience.${index}.bullet_points.${idx}`}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm resize-y"
                                      placeholder="Add accomplishment or responsibility..."
                                      onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                                        handleFieldBlur(`work_experience.${index}.bullet_points.${idx}`, e.target.value, setFieldError);
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newBulletPoints = [...values.work_experience[index].bullet_points];
                                        newBulletPoints.splice(idx, 1);
                                        setFieldValue(`work_experience.${index}.bullet_points`, newBulletPoints);
                                      }}
                                      className={deleteButtonClass}
                                    >
                                      <FaTrash className={deleteIconClass} />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentBulletPoints = values.work_experience[index].bullet_points || [];
                                    setFieldValue(`work_experience.${index}.bullet_points`, [...currentBulletPoints, '']);
                                  }}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <FaPlus className="w-3 h-3 mr-1" /> Add Bullet Point
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Work Experience Dialog */}
                    <Dialog
                      isOpen={dialogOpen.workExperience}
                      onClose={() => closeDialog('workExperience')}
                      title="Add Work Experience"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Company Name</label>
                          <Field
                            type="text"
                            name="newWorkExperience.company_name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter company name"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('newWorkExperience.company_name', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Job Title</label>
                          <Field
                            type="text"
                            name="newWorkExperience.job_title"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter job title"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('newWorkExperience.job_title', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Location</label>
                          <Field
                            type="text"
                            name="newWorkExperience.location"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter location"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('newWorkExperience.location', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <Field
                              type="date"
                              name="newWorkExperience.start_date"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                handleFieldBlur('newWorkExperience.start_date', e.target.value, setFieldError);
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <Field
                              type="date"
                              name="newWorkExperience.end_date"
                              disabled={values.newWorkExperience?.is_current}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                handleFieldBlur('newWorkExperience.end_date', e.target.value, setFieldError);
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Field
                            type="checkbox"
                            name="newWorkExperience.is_current"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('newWorkExperience.is_current', e.target.checked, setFieldError);
                            }}
                          />
                          <label className="ml-2 block text-sm text-gray-900">Currently Working Here</label>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Bullet Points</label>
                          <div className="space-y-3">
                            {values.newWorkExperience?.bullet_points?.map((point, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <Field
                                  as="textarea"
                                  rows={2}
                                  name={`newWorkExperience.bullet_points.${idx}`}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm resize-y"
                                  placeholder="Add accomplishment or responsibility..."
                                  onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                                    handleFieldBlur(`newWorkExperience.bullet_points.${idx}`, e.target.value, setFieldError);
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newPoints = [...(values.newWorkExperience?.bullet_points || [])];
                                    newPoints.splice(idx, 1);
                                    setFieldValue('newWorkExperience.bullet_points', newPoints);
                                  }}
                                  className={deleteButtonClass}
                                >
                                  <FaTrash className={deleteIconClass} />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const currentPoints = values.newWorkExperience?.bullet_points || [];
                                setFieldValue('newWorkExperience.bullet_points', [...currentPoints, '']);
                              }}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FaPlus className="w-3 h-3 mr-1" /> Add Bullet Point
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="button"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2"
                          onClick={() => {
                            const newWorkExperience = values.newWorkExperience;
                            if (newWorkExperience?.company_name && newWorkExperience?.job_title) {
                              const workExp = {
                                ...newWorkExperience,
                                bullet_points: newWorkExperience.bullet_points?.filter(point => point.trim()) || [],
                                end_date: newWorkExperience.is_current ? '' : newWorkExperience.end_date
                              };
                              setFieldValue('work_experience', [...values.work_experience, workExp]);
                              setFieldValue('newWorkExperience', {
                                company_name: '',
                                job_title: '',
                                location: '',
                                start_date: '',
                                end_date: '',
                                is_current: false,
                                bullet_points: ['']
                              });
                              closeDialog('workExperience');
                            }
                          }}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1"
                          onClick={() => closeDialog('workExperience')}
                        >
                          Cancel
                        </button>
                      </div>
                    </Dialog>

                    {/* Skills */}
                    <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
                        <button
                          type="button"
                          onClick={() => setDialogOpen({ ...dialogOpen, skills: true })}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-150"
                        >
                          <FaPlus className="mr-2" /> Add Skills
                        </button>
                      </div>
                      {(values.skills || []).map((skillCategory, categoryIndex) => (
                        <div
                          key={categoryIndex}
                          className="border border-gray-100 rounded-lg p-4 mb-4 last:mb-0 hover:border-gray-200 transition-all duration-200"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-medium text-gray-800">{skillCategory.category}</h3>
                            <button
                              type="button"
                              onClick={() => {
                                const newSkills = [...values.skills];
                                newSkills.splice(categoryIndex, 1);
                                setFieldValue('skills', newSkills);
                              }}
                              className={deleteButtonClass}
                            >
                              <FaTrash className={deleteIconClass} />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(skillCategory.skills || []).map((skill, skillIndex) => (
                              <div
                                key={skillIndex}
                                className="bg-blue-50 text-blue-800 px-3 py-1.5 rounded-full text-sm flex items-center group hover:bg-blue-100 transition-all duration-150"
                              >
                                <span>{skill}</span>
                                <button
                                  type="button"
                                  className="ml-2 text-blue-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                  onClick={() => {
                                    const newSkills = [...values.skills];
                                    newSkills[categoryIndex].skills = skillCategory.skills.filter(
                                      (_, index) => index !== skillIndex
                                    );
                                    setFieldValue('skills', newSkills);
                                  }}
                                >
                                  <FaTimes className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              className="bg-gray-50 text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-full text-sm flex items-center transition-colors duration-150"
                              onClick={() => {
                                const skill = window.prompt('Enter new skill');
                                if (skill) {
                                  const newSkills = [...values.skills];
                                  newSkills[categoryIndex].skills = [...skillCategory.skills, skill];
                                  setFieldValue('skills', newSkills);
                                }
                              }}
                            >
                              <FaPlus className="w-3 h-3 mr-1" /> Add Skill
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Skills Dialog */}
                    <Dialog
                      isOpen={dialogOpen.skills}
                      onClose={() => closeDialog('skills')}
                      title="Add Skills"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Category</label>
                          <Field
                            type="text"
                            name="newSkill.category"
                            placeholder="e.g., Programming Languages, Frameworks, Tools"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('newSkill.category', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Skills</label>
                          <Field
                            type="text"
                            name="newSkill.skills"
                            placeholder="Enter comma-separated skills"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('newSkill.skills', e.target.value, setFieldError);
                            }}
                          />
                          <p className="mt-1 text-sm text-gray-500">Separate multiple skills with commas (e.g., React, Node.js, TypeScript)</p>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="button"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2"
                          onClick={() => {
                            const category = values.newSkill?.category?.trim();
                            const skillsInput = values.newSkill?.skills?.trim();

                            if (category && skillsInput) {
                              const skillsList = skillsInput.split(',').map(skill => skill.trim()).filter(Boolean);
                              const newSkillCategory = {
                                category: category,
                                skills: skillsList
                              };

                              setFieldValue('skills', [...(values.skills || []), newSkillCategory]);
                              setFieldValue('newSkill', { category: '', skills: '' });
                              closeDialog('skills');
                            }
                          }}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1"
                          onClick={() => closeDialog('skills')}
                        >
                          Cancel
                        </button>
                      </div>
                    </Dialog>

                    {/* Projects */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => openDialog('projects')}
                        >
                          <FaPlus className="mr-2" /> Add Project
                        </button>
                      </div>
                      {(values.projects || []).map((proj, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-medium">{proj.project_name}</h3>
                            <button
                              type="button"
                              onClick={() => {
                                const newProjects = [...values.projects];
                                newProjects.splice(index, 1);
                                setFieldValue('projects', newProjects);
                              }}
                              className={deleteButtonClass}
                            >
                              <FaTrash className={deleteIconClass} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Project Name</label>
                              <Field
                                type="text"
                                name={`projects.${index}.project_name`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                  handleFieldBlur(`projects.${index}.project_name`, e.target.value, setFieldError);
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Organization</label>
                              <Field
                                type="text"
                                name={`projects.${index}.organization`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                  handleFieldBlur(`projects.${index}.organization`, e.target.value, setFieldError);
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Location</label>
                              <Field
                                type="text"
                                name={`projects.${index}.location`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                  handleFieldBlur(`projects.${index}.location`, e.target.value, setFieldError);
                                }}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                <Field
                                  type="month"
                                  name={`projects.${index}.start_date`}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                    handleFieldBlur(`projects.${index}.start_date`, e.target.value, setFieldError);
                                  }}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Completion Date</label>
                                <Field
                                  type="month"
                                  name={`projects.${index}.end_date`}
                                  disabled={proj.is_current}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                    handleFieldBlur(`projects.${index}.end_date`, e.target.value, setFieldError);
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="flex items-center space-x-2">
                                <Field
                                  type="checkbox"
                                  name={`projects.${index}.is_current`}
                                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                    handleFieldBlur(`projects.${index}.is_current`, e.target.checked, setFieldError);
                                  }}
                                />
                                <span className="text-sm font-medium text-gray-700">This is my current project</span>
                              </label>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Bullet Points</label>
                              <div className="space-y-2">
                                {proj.bullet_points?.map((point, idx) => (
                                  <div key={idx} className="flex items-center space-x-2">
                                    <Field
                                      type="text"
                                      name={`projects.${index}.bullet_points.${idx}`}
                                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                        handleFieldBlur(`projects.${index}.bullet_points.${idx}`, e.target.value, setFieldError);
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newPoints = [...(proj.bullet_points || [])];
                                        newPoints.splice(idx, 1);
                                        setFieldValue(`projects.${index}.bullet_points`, newPoints);
                                      }}
                                      className={deleteButtonClass}
                                    >
                                      <FaTrash className={deleteIconClass} />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentPoints = proj.bullet_points || [];
                                    setFieldValue(`projects.${index}.bullet_points`, [...currentPoints, '']);
                                  }}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <FaPlus className="mr-2" /> Add Bullet Point
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Projects Dialog */}
                    <Dialog
                      isOpen={dialogOpen.projects}
                      onClose={() => closeDialog('projects')}
                      title="Add Project"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Project Name</label>
                          <Field
                            type="text"
                            name="newProject.project_name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('newProject.project_name', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Organization</label>
                          <Field
                            type="text"
                            name="newProject.organization"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('newProject.organization', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Location</label>
                          <Field
                            type="text"
                            name="newProject.location"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('newProject.location', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <Field
                              type="month"
                              name="newProject.start_date"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                handleFieldBlur('newProject.start_date', e.target.value, setFieldError);
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Completion Date</label>
                            <Field
                              type="month"
                              name="newProject.end_date"
                              disabled={values.newProject?.is_current}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                handleFieldBlur('newProject.end_date', e.target.value, setFieldError);
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="flex items-center space-x-2">
                            <Field
                              type="checkbox"
                              name="newProject.is_current"
                              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                handleFieldBlur('newProject.is_current', e.target.checked, setFieldError);
                              }}
                            />
                            <span className="text-sm font-medium text-gray-700">This is my current project</span>
                          </label>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bullet Points</label>
                          <div className="space-y-2">
                            {values.newProject?.bullet_points?.map((point, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <Field
                                  type="text"
                                  name={`newProject.bullet_points.${idx}`}
                                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                    handleFieldBlur(`newProject.bullet_points.${idx}`, e.target.value, setFieldError);
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newPoints = [...(values.newProject?.bullet_points || [])];
                                    newPoints.splice(idx, 1);
                                    setFieldValue('newProject.bullet_points', newPoints);
                                  }}
                                  className={deleteButtonClass}
                                >
                                  <FaTrash className={deleteIconClass} />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const currentPoints = values.newProject?.bullet_points || [];
                                setFieldValue('newProject.bullet_points', [...currentPoints, '']);
                              }}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FaPlus className="mr-2" /> Add Bullet Point
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="button"
                          className="flex-1 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2"
                          onClick={() => {
                            const newProject = values.newProject;
                            if (newProject) {
                              setFieldValue('projects', [...values.projects, {
                                ...newProject,
                                bullet_points: newProject.bullet_points || []
                              }]);
                              setFieldValue('newProject', { bullet_points: [] });
                              closeDialog('projects');
                            }
                          }}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1"
                          onClick={() => closeDialog('projects')}
                        >
                          Cancel
                        </button>
                      </div>
                    </Dialog>

                    {/* Certifications */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => openDialog('certifications')}
                        >
                          <FaPlus className="mr-2" /> Add Certification
                        </button>
                      </div>
                      {values.certifications.map((cert, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-medium">{cert.name}</h3>
                            <button
                              type="button"
                              onClick={() => {
                                const newCertifications = [...values.certifications];
                                newCertifications.splice(index, 1);
                                setFieldValue('certifications', newCertifications);
                              }}
                              className={deleteButtonClass}
                            >
                              <FaTrash className={deleteIconClass} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Certification Name</label>
                              <Field
                                type="text"
                                name={`certifications.${index}.name`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                  handleFieldBlur(`certifications.${index}.name`, e.target.value, setFieldError);
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Description</label>
                              <Field
                                type="text"
                                name={`certifications.${index}.description`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                  handleFieldBlur(`certifications.${index}.description`, e.target.value, setFieldError);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Certifications Dialog */}
                    <Dialog
                      isOpen={dialogOpen.certifications}
                      onClose={() => closeDialog('certifications')}
                      title="Add Certification"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Certification Name</label>
                          <Field
                            type="text"
                            name="newCertification.name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('newCertification.name', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <Field
                            as="textarea"
                            name="newCertification.description"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                              handleFieldBlur('newCertification.description', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="button"
                          className="flex-1 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2"
                          onClick={() => {
                            const newCertification = values.newCertification;
                            if (newCertification) {
                              setFieldValue('certifications', [...values.certifications, { ...newCertification }]);
                              setFieldValue('newCertification', {});
                              closeDialog('certifications');
                            }
                          }}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1"
                          onClick={() => closeDialog('certifications')}
                        >
                          Cancel
                        </button>
                      </div>
                    </Dialog>

                    {/* Achievements */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => openDialog('achievements')}
                        >
                          <FaPlus className="mr-2" /> Add Achievement
                        </button>
                      </div>
                      {values.achievements.map((achievement, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-medium">{achievement.name}</h3>
                            <button
                              type="button"
                              onClick={() => {
                                const newAchievements = [...values.achievements];
                                newAchievements.splice(index, 1);
                                setFieldValue('achievements', newAchievements);
                              }}
                              className={deleteButtonClass}
                            >
                              <FaTrash className={deleteIconClass} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Name</label>
                              <Field
                                type="text"
                                name={`achievements.${index}.name`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                  handleFieldBlur(`achievements.${index}.name`, e.target.value, setFieldError);
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Description</label>
                              <Field
                                type="text"
                                name={`achievements.${index}.description`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                  handleFieldBlur(`achievements.${index}.description`, e.target.value, setFieldError);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Achievements Dialog */}
                    <Dialog
                      isOpen={dialogOpen.achievements}
                      onClose={() => closeDialog('achievements')}
                      title="Add Achievement"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <Field
                            type="text"
                            name="newAchievement.name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('newAchievement.name', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <Field
                            as="textarea"
                            name="newAchievement.description"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                              handleFieldBlur('newAchievement.description', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="button"
                          className="flex-1 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2"
                          onClick={() => {
                            const newAchievement = values.newAchievement;
                            if (newAchievement) {
                              setFieldValue('achievements', [...values.achievements, { ...newAchievement }]);
                              setFieldValue('newAchievement', {});
                              closeDialog('achievements');
                            }
                          }}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1"
                          onClick={() => closeDialog('achievements')}
                        >
                          Cancel
                        </button>
                      </div>
                    </Dialog>

                    {/* Languages */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Languages</h2>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => openDialog('languages')}
                        >
                          <FaPlus className="mr-2" /> Add Language
                        </button>
                      </div>
                      {values.languages.map((language, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-medium">{language.name}</h3>
                            <button
                              type="button"
                              onClick={() => {
                                const newLanguages = [...values.languages];
                                newLanguages.splice(index, 1);
                                setFieldValue('languages', newLanguages);
                              }}
                              className={deleteButtonClass}
                            >
                              <FaTrash className={deleteIconClass} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Name</label>
                              <Field
                                type="text"
                                name={`languages.${index}.name`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                  handleFieldBlur(`languages.${index}.name`, e.target.value, setFieldError);
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Proficiency Level</label>
                              <Field
                                as="select"
                                name={`languages.${index}.description`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                onBlur={(e: React.FocusEvent<HTMLSelectElement>) => {
                                  handleFieldBlur(`languages.${index}.description`, e.target.value, setFieldError);
                                }}
                              >
                                <option value="">Select Proficiency</option>
                                <option value="Native">Native</option>
                                <option value="Professional">Professional</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Basic">Basic</option>
                              </Field>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Languages Dialog */}
                    <Dialog
                      isOpen={dialogOpen.languages}
                      onClose={() => closeDialog('languages')}
                      title="Add Language"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <Field
                            type="text"
                            name="newLanguage.name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('newLanguage.name', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Proficiency Level</label>
                          <Field
                            as="select"
                            name="newLanguage.description"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onBlur={(e: React.FocusEvent<HTMLSelectElement>) => {
                              handleFieldBlur('newLanguage.description', e.target.value, setFieldError);
                            }}
                          >
                            <option value="">Select Proficiency</option>
                            <option value="Native">Native</option>
                            <option value="Professional">Professional</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Basic">Basic</option>
                          </Field>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="button"
                          className="flex-1 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2"
                          onClick={() => {
                            const newLanguage = values.newLanguage;
                            if (newLanguage) {
                              setFieldValue('languages', [...values.languages, { ...newLanguage }]);
                              setFieldValue('newLanguage', {});
                              closeDialog('languages');
                            }
                          }}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1"
                          onClick={() => closeDialog('languages')}
                        >
                          Cancel
                        </button>
                      </div>
                    </Dialog>

                    {/* Publications */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Publications</h2>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => openDialog('publications')}
                        >
                          <FaPlus className="mr-2" /> Add Publication
                        </button>
                      </div>
                      {values.publications.map((publication, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-medium">{publication.title}</h3>
                            <button
                              type="button"
                              onClick={() => {
                                const newPublications = [...values.publications];
                                newPublications.splice(index, 1);
                                setFieldValue('publications', newPublications);
                              }}
                              className={deleteButtonClass}
                            >
                              <FaTrash className={deleteIconClass} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Title</label>
                              <Field
                                type="text"
                                name={`publications.${index}.title`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                  handleFieldBlur(`publications.${index}.title`, e.target.value, setFieldError);
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Description</label>
                              <Field
                                type="text"
                                name={`publications.${index}.description`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                  handleFieldBlur(`publications.${index}.description`, e.target.value, setFieldError);
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Authors</label>
                              <div className="mt-1">
                                {publication.authors.join(', ')}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Publications Dialog */}
                    <Dialog
                      isOpen={dialogOpen.publications}
                      onClose={() => closeDialog('publications')}
                      title="Add Publication"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Title</label>
                          <Field
                            type="text"
                            name="newPublication.title"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              handleFieldBlur('newPublication.title', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <Field
                            as="textarea"
                            name="newPublication.description"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                              handleFieldBlur('newPublication.description', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Authors</label>
                          <Field
                            as="textarea"
                            name="newPublication.authors"
                            rows={2}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter authors (comma separated)"
                            onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                              handleFieldBlur('newPublication.authors', e.target.value, setFieldError);
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="button"
                          className="flex-1 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2"
                          onClick={() => {
                            const newPublication = values.newPublication;
                            if (newPublication) {
                              const authors = newPublication.authors ?
                                newPublication.authors.split(',').map(author => author.trim()) :
                                [];

                              setFieldValue('publications', [...values.publications, {
                                ...newPublication,
                                authors
                              }]);
                              setFieldValue('newPublication', {});
                              closeDialog('publications');
                            }
                          }}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1"
                          onClick={() => closeDialog('publications')}
                        >
                          Cancel
                        </button>
                      </div>
                    </Dialog>
                  </div>
                </Form>
              )}
            </Formik>

        }
      </div>
    </div >
  );
};

export default Profile;

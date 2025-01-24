import { useState, useEffect } from 'react';
import { ProfileData } from '../types/profile';
import { Formik, Form, Field } from 'formik';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import ResumeUpload from './ResumeUpload';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { BASE_API_URL } from '../utils/config';

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

  const updateSection = async (clerk_id: string, email: string, sectionName: string, content: unknown) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      console.log('Token used for request:', token);

      const requestData = {
        email,
        clerk_id,
        resume: {
          ...initialValues,
          [sectionName]: content,
        }
      };

      console.log('Request payload:', JSON.stringify(requestData, null, 2));

      const response = await axios.post(`${BASE_API_URL}/api/v1/profiles`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response:', response.data);
      setInitialValues(response.data.resume);

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

  const validationSchema = Yup.object().shape({
    personalInfo: Yup.object().shape({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      phoneNumber: Yup.string(),
      location: Yup.string(),
      linkedin: Yup.string().url('Invalid URL'),
      githubUrl: Yup.string().url('Invalid URL')
    }),
    summary: Yup.string(),
    education: Yup.array().of(
      Yup.object().shape({
        schoolName: Yup.string().required('Institution name is required'),
        degree: Yup.string().required('Degree is required'),
        location: Yup.string(),
        startDate: Yup.string().nullable(),
        completionDate: Yup.string().required('End date is required'),
        isCurrent: Yup.boolean(),
      })
    ),
    workExperience: Yup.array().of(
      Yup.object().shape({
        companyName: Yup.string().required('Company name is required'),
        jobTitle: Yup.string().required('Job title is required'),
        location: Yup.string(),
        startDate: Yup.string().required('Start date is required'),
        completionDate: Yup.string().required('End date is required'),
        isCurrent: Yup.boolean(),
        bulletPoints: Yup.array().of(Yup.string()),
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
        projectName: Yup.string().required('Project name is required'),
        organization: Yup.string(),
        location: Yup.string(),
        startDate: Yup.string(),
        completionDate: Yup.string(),
        isCurrent: Yup.boolean(),
        bulletPoints: Yup.array().of(Yup.string())
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
    personalInfo: {
      name: '',
      email: '',
      phoneNumber: '',
      location: '',
      linkedin: '',
      githubUrl: ''
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
    newEducation: {
      organization: '',
      accreditation: '',
      location: '',
      dates: {
        startDate: '',
        completionDate: '',
        isCurrent: false
      },
      courses: [],
      achievements: []
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
      bulletPoints: [],
      achievements: []
    },
    newSkill: {
      category: '',
      skills: ''
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
    }
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

        const response = await fetch(`${BASE_API_URL}/api/v1/profiles/clerk/${user.id}`, {
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


  const openDialog = (type: keyof DialogState) => {
    setDialogOpen({ ...dialogOpen, [type]: true });
  };

  const closeDialog = (type: keyof DialogState) => {
    setDialogOpen({ ...dialogOpen, [type]: false });
  };

  const handleFieldBlur = async (fieldName: string, value: string | boolean, setFieldError: (field: string, message: string | undefined) => void) => {
    if (!user?.id) return;

    try {
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

      await updateSection(user.id, user.primaryEmailAddress?.emailAddress || '', sectionName, updatedData[sectionName]);
      setFieldError(fieldName, undefined);
    } catch (error) {
      console.error('Error updating field:', error);
      setFieldError(fieldName, 'Failed to update field');
    }
  };

  const handleDelete = async (sectionName: string, newData: unknown[], sectionType: string) => {
    console.log('handleDelete', sectionName, newData, sectionType);
    const payload = {
      email: user?.primaryEmailAddress?.emailAddress,
      clerk_id: user?.id,
      resume: {
        personalInfo: { ...initialValues.personalInfo },
        summary: initialValues.summary,
        education: sectionType === 'education' ? newData : [...initialValues.education],
        workExperience: sectionType === 'workExperience' ? newData : [...initialValues.workExperience],
        skills: sectionType === 'skills' ? newData : { ...initialValues.skills },
        projects: sectionType === 'projects' ? newData : [...initialValues.projects],
        certifications: sectionType === 'certifications' ? newData : [...initialValues.certifications],
        achievements: sectionType === 'achievements' ? newData : [...initialValues.achievements],
        languages: sectionType === 'languages' ? newData : [...initialValues.languages],
        publications: sectionType === 'publications' ? newData : [...initialValues.publications],
      },
    };

    try {
      const response = await axios.post(`${BASE_API_URL}/api/v1/profiles`, payload);
      console.log('API Response:', response.data);
      toast.success(`${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)} deleted successfully`);
      setInitialValues(response.data.resume);
    } catch (error) {
      console.error('API Error:', error);
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

  const renderSkills = (values: ProfileData) => (
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
      {Object.entries(values.skills || {}).map(([category, skills]) => (
        <div
          key={category}
          className="border border-gray-100 rounded-lg p-4 mb-4 last:mb-0 hover:border-gray-200 transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-gray-800">{category}</h3>
            <button
              type="button"
              onClick={() => {
                const newSkills = { ...values.skills };
                delete newSkills[category];
                handleChange('skills', newSkills);
              }}
              className={deleteButtonClass}
            >
              <FaTrash className={deleteIconClass} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(skills) && skills.map((skill: string, skillIndex: number) => (
              <div
                key={`${category}-${skillIndex}`}
                className="bg-blue-50 text-blue-800 px-3 py-1.5 rounded-full text-sm flex items-center group hover:bg-blue-100 transition-all duration-150"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  className="ml-2 text-blue-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  onClick={() => {
                    const newSkills = { ...values.skills };
                    newSkills[category] = skills.filter((_: unknown, index: number) => index !== skillIndex);
                    handleChange('skills', newSkills);
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
                  const newSkills = { ...values.skills };
                  newSkills[category] = [...(skills || []), skill];
                  handleChange('skills', newSkills);
                }
              }}
            >
              <FaPlus className="w-3 h-3 mr-1" /> Add Skill
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const SkillsDialog = ({ values }: { values: ProfileData }) => (
    <Dialog
      isOpen={dialogOpen.skills}
      onClose={() => closeDialog('skills')}
      title="Add Skills Category"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category Name</label>
          <Field
            type="text"
            name="newSkill.category"
            placeholder="e.g., Frontend Development"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Skills</label>
          <Field
            type="text"
            name="newSkill.skills"
            placeholder="Enter comma-separated skills"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">Separate multiple skills with commas</p>
        </div>
      </div>
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2"
          onClick={() => {
            console.log('values', values);
            const category = values.newSkill?.category;
            const skillsInput = values.newSkill?.skills;
            console.log('category', category);
            console.log('skillsInput', skillsInput);
            if (category && skillsInput) {
              const skillsList = skillsInput.split(',').map((skill: string) => skill.trim()).filter(Boolean);
              const newSkills = { ...values.skills };
              newSkills[category] = skillsList;
              handleChange('skills', newSkills);
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
  );

  const renderPersonalInfo = (values: ProfileData, setFieldError: (field: string, message: string | undefined) => void) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Field
            type="text"
            name="personalInfo.name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your full name"
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              handleFieldBlur('personalInfo.name', e.target.value, setFieldError);
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <Field
            type="email"
            name="personalInfo.email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your email"
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              handleFieldBlur('personalInfo.email', e.target.value, setFieldError);
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <Field
            type="text"
            name="personalInfo.phoneNumber"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your phone number"
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              handleFieldBlur('personalInfo.phoneNumber', e.target.value, setFieldError);
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <Field
            type="text"
            name="personalInfo.location"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your location"
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              handleFieldBlur('personalInfo.location', e.target.value, setFieldError);
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
          <Field
            type="url"
            name="personalInfo.linkedin"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your LinkedIn profile URL"
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              handleFieldBlur('personalInfo.linkedin', e.target.value, setFieldError);
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
          <Field
            type="url"
            name="personalInfo.githubUrl"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your GitHub profile URL"
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              handleFieldBlur('personalInfo.githubUrl', e.target.value, setFieldError);
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderEducation = (values: ProfileData, setFieldError: (field: string, message: string | undefined) => void, setFieldValue: (field: string, value: unknown) => void) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Education</h2>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => {
            openDialog('education')
          }}
        >
          <FaPlus className="mr-2" /> Add Education
        </button>
      </div>
      {values?.education?.map((edu, index) => (
        <div key={index} className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium">{edu?.organization}</h3>
            <button
              type="button"
              onClick={() => {
                const newEducation = [...values.education];
                newEducation.splice(index, 1);
                setFieldValue('education', newEducation);
                handleDelete('education', newEducation, 'education');
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
                name={`education.${index}.organization`}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  handleFieldBlur(`education.${index}.organization`, e.target.value, setFieldError);
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Accreditation</label>
              <Field
                type="text"
                name={`education.${index}.accreditation`}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  handleFieldBlur(`education.${index}.accreditation`, e.target.value, setFieldError);
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
                name={`education.${index}.dates.startDate`}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  handleFieldBlur(`education.${index}.dates.startDate`, e.target.value, setFieldError);
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <Field
                type="date"
                name={`education.${index}.dates.completionDate`}
                disabled={values.education[index]?.dates?.isCurrent}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  handleFieldBlur(`education.${index}.dates.completionDate`, e.target.value, setFieldError);
                }}
              />
            </div>
            <div className="flex items-center mt-6">
              <Field
                type="checkbox"
                name={`education.${index}.dates.isCurrent`}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  handleFieldBlur(`education.${index}.dates.isCurrent`, e.target.checked, setFieldError);
                }}
              />
              <label className="ml-2 block text-sm text-gray-900">Currently Studying</label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEducationDialog = (values: ProfileData, setFieldError: (field: string, message: string | undefined) => void, setFieldValue: (field: string, value: unknown) => void) => (
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
            name="newEducation.organization"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter school name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Degree</label>
          <Field
            type="text"
            name="newEducation.accreditation"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter accreditation"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <Field
            type="text"
            name="newEducation.location"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter location"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <Field
            type="date"
            name="newEducation.dates.startDate"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <Field
            type="date"
            name="newEducation.dates.completionDate"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center">
          <Field
            type="checkbox"
            name="newEducation.dates.isCurrent"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">Currently Studying</label>
        </div>
      </div>
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
        <button
          type="button"
          onClick={() => {
            const newEducation = { ...values.newEducation };
            handleChange('education', [...values.education, newEducation]);
            setFieldValue('newEducation', {
              organization: '',
              accreditation: '',
              location: '',
              dates: {
                startDate: '',
                completionDate: '',
                isCurrent: false
              }
            });
            closeDialog('education');
          }}
          className="flex-1 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add
        </button>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => {
            closeDialog('education');
          }}
        >
          Cancel
        </button>
      </div>
    </Dialog>
  );

  const renderWorkExperience = (values: ProfileData, setFieldError: (field: string, message: string | undefined) => void, setFieldValue: (field: string, value: unknown) => void) => (
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

      {values.workExperience.map((experience, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4 hover:border-gray-300 transition-colors duration-200">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">
              {experience.jobTitle} at {experience.organization}
            </h3>
            <button
              type="button"
              onClick={() => {
                const newWorkExperience = [...values.workExperience];
                newWorkExperience.splice(index, 1);
                setFieldValue('workExperience', newWorkExperience);
                handleDelete('workExperience', newWorkExperience, 'workExperience');
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
                  name={`workExperience.${index}.organization`}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  placeholder="Enter company name"
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    handleFieldBlur(`workExperience.${index}.organization`, e.target.value, setFieldError);
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <Field
                  type="text"
                  name={`workExperience.${index}.jobTitle`}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  placeholder="Enter job title"
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    handleFieldBlur(`workExperience.${index}.jobTitle`, e.target.value, setFieldError);
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <Field
                type="text"
                name={`workExperience.${index}.location`}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                placeholder="Enter location"
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  handleFieldBlur(`workExperience.${index}.location`, e.target.value, setFieldError);
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <Field
                  type="date"
                  name={`workExperience.${index}.dates.startDate`}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    handleFieldBlur(`workExperience.${index}.dates.startDate`, e.target.value, setFieldError);
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <Field
                  type="date"
                  name={`workExperience.${index}.dates.completionDate`}
                  disabled={values.workExperience[index]?.dates?.isCurrent}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    handleFieldBlur(`workExperience.${index}.dates.completionDate`, e.target.value, setFieldError);
                  }}
                />
              </div>
            </div>

            <div className="flex items-center">
              <Field
                type="checkbox"
                name={`workExperience.${index}.dates.isCurrent`}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  handleFieldBlur(`workExperience.${index}.dates.isCurrent`, e.target.checked, setFieldError);
                }}
              />
              <label className="ml-2 text-sm text-gray-900">Currently Working</label>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Bullet Points</label>
              <div className="space-y-3">
                {values.workExperience[index].bulletPoints?.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Field
                      as="textarea"
                      rows={2}
                      name={`workExperience.${index}.bulletPoints.${idx}`}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm resize-y"
                      placeholder="Add accomplishment or responsibility..."
                      onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                        const newWorkExperience = [...values.workExperience];
                        newWorkExperience[index].bulletPoints[idx] = e.target.value;
                        setFieldValue('workExperience', newWorkExperience);
                        handleChange('workExperience', newWorkExperience);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newBulletPoints = [...values.workExperience[index].bulletPoints];
                        newBulletPoints.splice(idx, 1);
                        setFieldValue(`workExperience.${index}.bulletPoints`, newBulletPoints);
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
                    const currentBulletPoints = values.workExperience[index].bulletPoints || [];
                    setFieldValue(`workExperience.${index}.bulletPoints`, [...currentBulletPoints, '']);
                    handleChange('workExperience', values.workExperience);
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
  );

  const renderWorkExperienceDialog = (values: ProfileData, setFieldError: (field: string, message: string | undefined) => void, setFieldValue: (field: string, value: unknown) => void) => (
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
            name="newWorkExperience.organization"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter company name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Title</label>
          <Field
            type="text"
            name="newWorkExperience.jobTitle"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter job title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <Field
            type="text"
            name="newWorkExperience.location"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter location"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <Field
              type="date"
              name="newWorkExperience.dates.startDate"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <Field
              type="date"
              name="newWorkExperience.dates.completionDate"
              disabled={values.newWorkExperience?.dates?.isCurrent}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>
        <div className="flex items-center">
          <Field
            type="checkbox"
            name="newWorkExperience.dates.isCurrent"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label className="ml-2 block text-sm text-gray-900">Currently Working Here</label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bullet Points</label>
          <div className="space-y-3">
            {values.newWorkExperience?.bulletPoints?.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Field
                  as="textarea"
                  rows={2}
                  name={`newWorkExperience.bulletPoints.${idx}`}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm resize-y"
                  placeholder="Add accomplishment or responsibility..."
                />
                <button
                  type="button"
                  onClick={() => {
                    const newPoints = [...(values.newWorkExperience?.bulletPoints || [])];
                    newPoints.splice(idx, 1);
                    setFieldValue('newWorkExperience.bulletPoints', newPoints);
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
                const currentPoints = values.newWorkExperience?.bulletPoints || [];
                setFieldValue('newWorkExperience.bulletPoints', [...currentPoints, '']);
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
            const newWorkExperience = { ...values.newWorkExperience };
            handleChange('workExperience', [...values.workExperience, newWorkExperience]);
            setFieldValue('newWorkExperience', {
              organization: '',
              jobTitle: '',
              location: '',
              dates: {
                startDate: '',
                completionDate: '',
                isCurrent: false
              },
              bulletPoints: [],
              achievements: []
            });
            closeDialog('workExperience');
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
  );


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-2">
      <div className="relative sm:max-w-xl md:max-w-4xl sm:mx-auto">

        {
          !initialValues?.personalInfo?.name ?
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
                  <ResumeUpload isButton onUploadSuccess={handleResumeData} />
                  <div className="space-y-8">
                    {/* Personal Information */}
                    {renderPersonalInfo(values, setFieldError)}

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
                    {renderEducation(values, setFieldError, setFieldValue)}
                    {/* Education Dialog */}
                    {renderEducationDialog(values, setFieldError, setFieldValue)}

                    {/* Work Experience */}
                    {renderWorkExperience(values, setFieldError, setFieldValue)}

                    {/* Work Experience Dialog */}
                    {renderWorkExperienceDialog(values, setFieldError, setFieldValue)}

                    {/* Skills */}
                    {renderSkills(values)}

                    {/* Skills Dialog */}
                    <SkillsDialog values={values} />

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
                            <h3 className="text-lg font-medium">{proj.projectName}</h3>
                            <button
                              type="button"
                              onClick={() => {
                                const newProjects = [...values.projects];
                                newProjects.splice(index, 1);
                                setFieldValue('projects', newProjects);
                                handleDelete('projects', newProjects, 'projects');
                              }}
                              className={deleteButtonClass}
                            >
                              <FaTrash className={deleteIconClass} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                                <Field
                                  type="text"
                                  name={`projects.${index}.projectName`}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                    handleFieldBlur(`projects.${index}.projectName`, e.target.value, setFieldError);
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
                                    name={`projects.${index}.dates.startDate`}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                      handleFieldBlur(`projects.${index}.dates.startDate`, e.target.value, setFieldError);
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">Completion Date</label>
                                  <Field
                                    type="month"
                                    name={`projects.${index}.dates.completionDate`}
                                    disabled={proj.dates.isCurrent}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                      handleFieldBlur(`projects.${index}.dates.completionDate`, e.target.value, setFieldError);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Field
                                type="checkbox"
                                name={`projects.${index}.dates.isCurrent`}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                  handleFieldBlur(`projects.${index}.dates.isCurrent`, e.target.checked, setFieldError);
                                }}
                              />
                              <label className="ml-2 text-sm text-gray-900">This is my current project</label>
                            </div>
                            <div className="space-y-4">
                              <label className="block text-sm font-medium text-gray-700">Bullet Points</label>
                              <div className="space-y-3">
                                {proj.bulletPoints?.map((point, idx) => (
                                  <div key={idx} className="flex items-center">
                                    <Field
                                      type="text"
                                      rows={2}
                                      name={`projects.${index}.bulletPoints.${idx}`}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm resize-y"
                                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                        const newProjects = [...values.projects];
                                        newProjects[index].bulletPoints[idx] = e.target.value;
                                        setFieldValue('projects', newProjects);
                                        handleChange('projects', newProjects);
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newProjects = [...values.projects];
                                        newProjects[index].bulletPoints.splice(idx, 1);
                                        setFieldValue('projects', newProjects);
                                        handleChange('projects', newProjects);
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
                                    const currentPoints = values.projects[index].bulletPoints || [];
                                    setFieldValue(`projects.${index}.bulletPoints`, [...currentPoints, '']);
                                    handleChange('projects', values.projects);
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
                            name="newProject.projectName"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Organization</label>
                          <Field
                            type="text"
                            name="newProject.organization"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Location</label>
                          <Field
                            type="text"
                            name="newProject.location"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <Field
                              type="month"
                              name="newProject.dates.startDate"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Completion Date</label>
                            <Field
                              type="month"
                              name="newProject.dates.completionDate"
                              disabled={values.newProject?.dates?.isCurrent}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="flex items-center space-x-2">
                            <Field
                              type="checkbox"
                              name="newProject.dates.isCurrent"
                              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">This is my current project</span>
                          </label>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bullet Points</label>
                          <div className="space-y-2">
                            {Array.isArray(values.newProject?.bulletPoints) && values.newProject.bulletPoints.map((point, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <Field
                                  type="text"
                                  name={`newProject.bulletPoints.${idx}`}
                                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newPoints = [...(values.newProject?.bulletPoints as string[])];
                                    newPoints.splice(idx, 1);
                                    setFieldValue('newProject.bulletPoints', newPoints);
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
                                const currentPoints = Array.isArray(values.newProject?.bulletPoints)
                                  ? values.newProject.bulletPoints
                                  : [];
                                setFieldValue('newProject.bulletPoints', [...currentPoints, '']);
                              }}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Add Bullet Point
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
                              const projectData = {
                                projectName: newProject.projectName || '',
                                organization: newProject.organization || '',
                                location: newProject.location || '',
                                dates: newProject.dates || { startDate: '', completionDate: '', isCurrent: false },
                                bulletPoints: newProject.bulletPoints || []
                              };

                              setFieldValue('projects', [...values.projects, projectData]);
                              handleChange('projects', [...values.projects, projectData]);
                              setFieldValue('newProject', {
                                projectName: '',
                                organization: '',
                                location: '',
                                dates: { startDate: '', completionDate: '', isCurrent: false },
                                bulletPoints: []
                              });
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
                                handleDelete('certifications', newCertifications, 'certifications');
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
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <Field
                            as="textarea"
                            name="newCertification.description"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                              handleChange('certifications', [...values.certifications, { ...newCertification }]);
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
                                handleDelete('achievements', newAchievements, 'achievements');
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
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <Field
                            as="textarea"
                            name="newAchievement.description"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                              handleChange('achievements', [...values.achievements, { ...newAchievement }]);
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
                                handleDelete('languages', newLanguages, 'languages');
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
                                <option value="Basic">Basic</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Professional">Professional</option>
                                <option value="Native">Native</option>
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
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Proficiency Level</label>
                          <Field
                            as="select"
                            name="newLanguage.description"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                              handleChange('languages', [...values.languages, { ...newLanguage }]);
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
                                handleDelete('publications', newPublications, 'publications');
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
                                as="textarea"
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
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <Field
                            as="textarea"
                            name="newPublication.description"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                              const publicationData = {
                                title: newPublication.title || '',
                                description: newPublication.description || '',
                                authors: typeof newPublication.authors === 'string'
                                  ? (newPublication.authors as string).split(',').map(author => author.trim())
                                  : newPublication.authors || []
                              };

                              setFieldValue('publications', [...values.publications, publicationData]);
                              handleChange('publications', [...values.publications, publicationData]);
                              setFieldValue('newPublication', {
                                title: '',
                                description: '',
                                authors: []
                              });
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
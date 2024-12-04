import { useState, useEffect } from 'react';
import { ProfileData } from '@/types/profile';
import { Formik, Form, Field } from 'formik';
import { FaPlus, FaTrash, FaSpinner } from 'react-icons/fa';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import ResumeUpload from './ResumeUpload';

const initialData: ProfileData = {
  pii: {
    full_name: '',
    email: '',
    phone: '',
  },
  education: [],
  work_experience: [],
  skills: {
    'Programming Languages': [],
    'Tools': [],
    'Other': [],
  },
};

const validationSchema = Yup.object().shape({
  pii: Yup.object().shape({
    full_name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    phone: Yup.string().required('Required'),
  }),
  education: Yup.array().of(
    Yup.object().shape({
      organization: Yup.string().required('Institution name is required'),
      degree: Yup.string().required('Degree is required'),
      start_date: Yup.string().nullable(),
      end_date: Yup.string().required('End date is required'),
      achievements: Yup.array().of(Yup.string()),
    })
  ),
  work_experience: Yup.array().of(
    Yup.object().shape({
      job_title: Yup.string().required('Job title is required'),
      company_name: Yup.string().required('Company name is required'),
      location: Yup.string().required('Location is required'),
      start_date: Yup.string().required('Start date is required'),
      end_date: Yup.string().required('End date is required'),
      bullet_points: Yup.array().of(Yup.string()),
    })
  ),
  skills: Yup.object().shape({
    'Programming Languages': Yup.array().of(Yup.string()),
    Tools: Yup.array().of(Yup.string()),
    Other: Yup.array().of(Yup.string()),
  }),
});

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileData>(initialData);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/profile/save', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Profile response:', {
          status: response.status,
          statusText: response.statusText
        });

        const data = await response.json();
        console.log('Profile data:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch profile');
        }

        if (data?.resume_data) {
          setProfileData(data.resume_data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to load profile data');
      }
    }

    fetchProfile();
  }, []);

  const handleResumeData = (apiResponse: any) => {
    const transformedData = {
      pii: {
        full_name: apiResponse.result.pii.full_name || '',
        email: apiResponse.result.pii.email || '',
        phone: apiResponse.result.pii.phone || '',
      },
      education: apiResponse.result.education.map((edu: any) => ({
        organization: edu.organization || '',
        degree: edu.degree || '',
        major: edu.major || '',
        start_date: edu.start_date || '',
        end_date: edu.end_date || '',
        achievements: Array.isArray(edu.achievements) ? edu.achievements : []
      })),
      work_experience: apiResponse.result.work_experience.map((exp: any) => ({
        job_title: exp.job_title || '',
        company_name: exp.company_name || '',
        location: exp.location || '',
        start_date: exp.start_date || '',
        end_date: exp.end_date || '',
        bullet_points: Array.isArray(exp.bullet_points) ? exp.bullet_points : []
      })),
      skills: {
        'Programming Languages': Array.isArray(apiResponse.result.skills?.['Programming Languages'])
          ? apiResponse.result.skills['Programming Languages']
          : [],
        'Tools': Array.isArray(apiResponse.result.skills?.Tools)
          ? apiResponse.result.skills.Tools
          : [],
        'Other': Array.isArray(apiResponse.result.skills?.Other)
          ? apiResponse.result.skills.Other
          : []
      }
    };
    setProfileData(transformedData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Resume Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Resume</h2>
          <div className="w-full max-w-md mx-auto">
            <ResumeUpload onUploadSuccess={handleResumeData} />
          </div>
        </div>

        <Formik
          initialValues={profileData}
          enableReinitialize={true}
          validationSchema={validationSchema}
          validateOnMount={false}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ isSubmitting, values, setFieldValue, setSubmitting }) => (
            <Form className="space-y-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="pii.full_name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <Field
                        type="text"
                        id="pii.full_name"
                        name="pii.full_name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="pii.email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <Field
                        type="email"
                        id="pii.email"
                        name="pii.email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="pii.phone" className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <Field
                        type="text"
                        id="pii.phone"
                        name="pii.phone"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => {
                        const newEducation = {
                          organization: '',
                          degree: '',
                          major: '',
                          start_date: '',
                          end_date: '',
                          achievements: []
                        };
                        setFieldValue('education', [...values.education, newEducation]);
                      }}
                    >
                      <FaPlus className="mr-2" /> Add Education
                    </button>
                  </div>
                  {values.education.map((edu, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                      <div className="flex justify-end mb-4">
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          onClick={() => {
                            const newEducation = [...values.education];
                            newEducation.splice(index, 1);
                            setFieldValue('education', newEducation);
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Institution</label>
                          <Field
                            type="text"
                            name={`education.${index}.organization`}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Degree</label>
                          <Field
                            type="text"
                            name={`education.${index}.degree`}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Date</label>
                          <Field
                            type="date"
                            name={`education.${index}.start_date`}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">End Date</label>
                          <Field
                            type="date"
                            name={`education.${index}.end_date`}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Work Experience */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => {
                        const newExperience = {
                          job_title: '',
                          company_name: '',
                          location: '',
                          start_date: '',
                          end_date: '',
                          bullet_points: []
                        };
                        setFieldValue('work_experience', [...values.work_experience, newExperience]);
                      }}
                    >
                      <FaPlus className="mr-2" /> Add Experience
                    </button>
                  </div>
                  {values.work_experience.map((exp, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                      <div className="flex justify-end mb-4">
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          onClick={() => {
                            const newExperience = [...values.work_experience];
                            newExperience.splice(index, 1);
                            setFieldValue('work_experience', newExperience);
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Job Title</label>
                          <Field
                            type="text"
                            name={`work_experience.${index}.job_title`}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Company</label>
                          <Field
                            type="text"
                            name={`work_experience.${index}.company_name`}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Location</label>
                          <Field
                            type="text"
                            name={`work_experience.${index}.location`}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Date</label>
                          <Field
                            type="date"
                            name={`work_experience.${index}.start_date`}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">End Date</label>
                          <Field
                            type="text"
                            name={`work_experience.${index}.end_date`}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Responsibilities & Achievements</label>
                        {exp.bullet_points.map((point, pointIndex) => (
                          <div key={pointIndex} className="mt-2 flex items-start gap-2">
                            <Field
                              as="textarea"
                              name={`work_experience.${index}.bullet_points.${pointIndex}`}
                              rows={2}
                              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => {
                                const newBulletPoints = [...exp.bullet_points];
                                newBulletPoints.splice(pointIndex, 1);
                                setFieldValue(`work_experience.${index}.bullet_points`, newBulletPoints);
                              }}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="mt-2 text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          onClick={() => {
                            const newBulletPoints = [...exp.bullet_points, ''];
                            setFieldValue(`work_experience.${index}.bullet_points`, newBulletPoints);
                          }}
                        >
                          <FaPlus /> Add Point
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
                  {Object.entries(values.skills).map(([category, skills]) => (
                    <div key={category} className="mb-8 last:mb-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {(skills as string[]).map((skill, index) => (
                            <div
                              key={index}
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100 transition-all duration-200 hover:bg-blue-100"
                            >
                              {skill}
                              <button
                                type="button"
                                className="ml-2 text-blue-400 hover:text-blue-600 transition-colors duration-200"
                                onClick={() => {
                                  const newSkills = [...skills];
                                  newSkills.splice(index, 1);
                                  setFieldValue(`skills.${category}`, newSkills);
                                }}
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-md">
                            <div className="relative">
                              <input
                                type="text"
                                placeholder={`Type a ${category.toLowerCase()} skill and press Enter`}
                                className="w-full rounded-lg border-gray-300 pr-12 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const input = e.target as HTMLInputElement;
                                    const skill = input.value.trim();
                                    if (skill && !(skills as string[]).includes(skill)) {
                                      setFieldValue(`skills.${category}`, [...skills, skill]);
                                      input.value = '';
                                    }
                                  }
                                }}
                              />
                              <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors duration-200"
                                onClick={(e) => {
                                  const input = (e.target as HTMLElement).closest('.relative')?.querySelector('input') as HTMLInputElement;
                                  const skill = input?.value.trim();
                                  if (skill && !(skills as string[]).includes(skill)) {
                                    setFieldValue(`skills.${category}`, [...skills, skill]);
                                    input.value = '';
                                  }
                                }}
                              >
                                <FaPlus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
                    onClick={async () => {
                      setSubmitting(true);
                      try {
                        const response = await fetch('/api/profile/save', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(values),
                        });

                        const data = await response.json();
                        if (!response.ok) {
                          throw new Error(data.error || 'Failed to save profile');
                        }

                        toast.success('Profile saved successfully');
                      } catch (err) {
                        toast.error(err instanceof Error ? err.message : 'Failed to save profile');
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      'Save Profile'
                    )}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Profile;

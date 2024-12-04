import { Formik, Form, Field, FieldArray } from 'formik';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { ProfileData } from '@/types/profile';

interface ProfileFormProps {
  initialData: ProfileData;
  activeTab: string;
}

export default function ProfileForm({ initialData, activeTab }: ProfileFormProps) {
  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <Field
          name="pii.full_name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <Field
          name="pii.email"
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <Field
          name="pii.phone"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderEducation = () => (
    <FieldArray name="education">
      {({ push, remove }) => (
        <div className="space-y-6">
          {initialData.education.map((_, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Organization</label>
                <Field
                  name={`education.${index}.organization`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Degree</label>
                <Field
                  name={`education.${index}.degree`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <Field
                    name={`education.${index}.start_date`}
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <Field
                    name={`education.${index}.end_date`}
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <FieldArray name={`education.${index}.achievements`}>
                {({ push: pushAchievement, remove: removeAchievement }) => (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Achievements</label>
                    {initialData.education[index].achievements.map((_, achievementIndex) => (
                      <div key={achievementIndex} className="flex gap-2">
                        <Field
                          name={`education.${index}.achievements.${achievementIndex}`}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeAchievement(achievementIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => pushAchievement('')}
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <FaPlus /> Add Achievement
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>
          ))}
          <button
            type="button"
            onClick={() => push({
              organization: '',
              degree: '',
              major: null,
              start_date: null,
              end_date: '',
              achievements: []
            })}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Education
          </button>
        </div>
      )}
    </FieldArray>
  );

  const renderExperience = () => (
    <FieldArray name="work_experience">
      {({ push, remove }) => (
        <div className="space-y-6">
          {initialData.work_experience.map((_, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <Field
                  name={`work_experience.${index}.job_title`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <Field
                  name={`work_experience.${index}.company_name`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <Field
                  name={`work_experience.${index}.location`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <Field
                    name={`work_experience.${index}.start_date`}
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <Field
                    name={`work_experience.${index}.end_date`}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <FieldArray name={`work_experience.${index}.bullet_points`}>
                {({ push: pushPoint, remove: removePoint }) => (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Bullet Points</label>
                    {initialData.work_experience[index].bullet_points.map((_, pointIndex) => (
                      <div key={pointIndex} className="flex gap-2">
                        <Field
                          name={`work_experience.${index}.bullet_points.${pointIndex}`}
                          as="textarea"
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removePoint(pointIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => pushPoint('')}
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <FaPlus /> Add Bullet Point
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>
          ))}
          <button
            type="button"
            onClick={() => push({
              job_title: '',
              company_name: '',
              location: '',
              start_date: '',
              end_date: '',
              bullet_points: []
            })}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Experience
          </button>
        </div>
      )}
    </FieldArray>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      {Object.entries(initialData.skills).map(([category, skills]) => (
        <div key={category} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{category}</label>
          <FieldArray name={`skills.${category}`}>
            {({ push, remove }) => (
              <div className="space-y-2">
                {skills.map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <Field
                      name={`skills.${category}.${index}`}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => push('')}
                  className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                >
                  <FaPlus /> Add {category} Skill
                </button>
              </div>
            )}
          </FieldArray>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Personal Info':
        return renderPersonalInfo();
      case 'Education':
        return renderEducation();
      case 'Experience':
        return renderExperience();
      case 'Skills':
        return renderSkills();
      default:
        return null;
    }
  };

  return (
    <Formik
      initialValues={initialData}
      onSubmit={(values) => {
        console.log(values);
        // TODO: Implement save functionality
      }}
    >
      <Form className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {renderContent()}
          {activeTab !== 'Resume' && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </Form>
    </Formik>
  );
}

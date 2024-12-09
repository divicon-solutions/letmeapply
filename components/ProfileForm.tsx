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
      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <Field
          name="pii.location"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
        <Field
          name="pii.linkedin"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">GitHub</label>
        <Field
          name="pii.githubUrl"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
        <Field
          name="summary"
          as="textarea"
          rows={4}
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
                <label className="block text-sm font-medium text-gray-700">Accreditation</label>
                <Field
                  name={`education.${index}.accreditation`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <Field
                  name={`education.${index}.location`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <Field
                    name={`education.${index}.dates.startDate`}
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <Field
                    name={`education.${index}.dates.completionDate`}
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current</label>
                  <Field
                    type="checkbox"
                    name={`education.${index}.dates.isCurrent`}
                    className="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              accreditation: '',
              location: '',
              dates: {
                startDate: '',
                completionDate: '',
                isCurrent: false
              },
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
                  name={`work_experience.${index}.jobTitle`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Organization</label>
                <Field
                  name={`work_experience.${index}.organization`}
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
                    name={`work_experience.${index}.dates.startDate`}
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <Field
                    name={`work_experience.${index}.dates.completionDate`}
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current</label>
                  <Field
                    type="checkbox"
                    name={`work_experience.${index}.dates.isCurrent`}
                    className="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <FieldArray name={`work_experience.${index}.bulletPoints`}>
                {({ push: pushBullet, remove: removeBullet }) => (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Bullet Points</label>
                    {initialData.work_experience[index].bulletPoints.map((_, bulletIndex) => (
                      <div key={bulletIndex} className="flex gap-2">
                        <Field
                          name={`work_experience.${index}.bulletPoints.${bulletIndex}`}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeBullet(bulletIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => pushBullet('')}
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
              jobTitle: '',
              organization: '',
              location: '',
              dates: {
                startDate: '',
                completionDate: '',
                isCurrent: false
              },
              bulletPoints: [],
              achievements: []
            })}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Work Experience
          </button>
        </div>
      )}
    </FieldArray>
  );

  const renderProjects = () => (
    <FieldArray name="projects">
      {({ push, remove }) => (
        <div className="space-y-6">
          {initialData.projects?.map((_, index) => (
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
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <Field
                  name={`projects.${index}.name`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Organization</label>
                <Field
                  name={`projects.${index}.organization`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <Field
                  name={`projects.${index}.location`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <Field
                    name={`projects.${index}.dates.startDate`}
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <Field
                    name={`projects.${index}.dates.completionDate`}
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <FieldArray name={`projects.${index}.bulletPoints`}>
                {({ push: pushBullet, remove: removeBullet }) => (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Bullet Points</label>
                    {initialData.projects?.[index].bulletPoints.map((_, bulletIndex) => (
                      <div key={bulletIndex} className="flex gap-2">
                        <Field
                          name={`projects.${index}.bulletPoints.${bulletIndex}`}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeBullet(bulletIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => pushBullet('')}
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
              name: '',
              organization: '',
              location: '',
              dates: {
                startDate: '',
                completionDate: ''
              },
              bulletPoints: []
            })}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Project
          </button>
        </div>
      )}
    </FieldArray>
  );

  const renderCertifications = () => (
    <FieldArray name="certifications">
      {({ push, remove }) => (
        <div className="space-y-6">
          {initialData.certifications?.map((_, index) => (
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
                <label className="block text-sm font-medium text-gray-700">Certification Name</label>
                <Field
                  name={`certifications.${index}.name`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <Field
                  name={`certifications.${index}.description`}
                  as="textarea"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => push({
              name: '',
              description: ''
            })}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Certification
          </button>
        </div>
      )}
    </FieldArray>
  );

  const renderSkills = () => (
    <FieldArray name="skills">
      {({ push, remove }) => (
        <div className="space-y-6">
          {Object.entries(initialData.skills || {}).map(([category, skills], index) => (
            <div key={category} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <Field
                  name={`skills[${index}].category`}
                  className="font-medium text-gray-700 border-none bg-transparent"
                  placeholder="Category Name"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
              <FieldArray name={`skills[${index}].skills`}>
                {({ push: pushSkill, remove: removeSkill }) => (
                  <div className="space-y-2">
                    {skills.map((_, skillIndex) => (
                      <div key={skillIndex} className="flex gap-2">
                        <Field
                          name={`skills[${index}].skills[${skillIndex}]`}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeSkill(skillIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => pushSkill('')}
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <FaPlus /> Add Skill
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>
          ))}
          <button
            type="button"
            onClick={() => push({ category: '', skills: [] })}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Skill Category
          </button>
        </div>
      )}
    </FieldArray>
  );

  const renderAchievements = () => (
    <FieldArray name="achievements">
      {({ push, remove }) => (
        <div className="space-y-6">
          {initialData.achievements?.map((_, index) => (
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
                <label className="block text-sm font-medium text-gray-700">Achievement Name</label>
                <Field
                  name={`achievements.${index}.name`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <Field
                  name={`achievements.${index}.description`}
                  as="textarea"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => push({
              name: '',
              description: ''
            })}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Achievement
          </button>
        </div>
      )}
    </FieldArray>
  );

  const renderLanguages = () => (
    <FieldArray name="languages">
      {({ push, remove }) => (
        <div className="space-y-6">
          {initialData.languages?.map((_, index) => (
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
                <label className="block text-sm font-medium text-gray-700">Language</label>
                <Field
                  name={`languages.${index}.name`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Proficiency Level</label>
                <Field
                  name={`languages.${index}.description`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => push({
              name: '',
              description: ''
            })}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Language
          </button>
        </div>
      )}
    </FieldArray>
  );

  const renderPublications = () => (
    <FieldArray name="publications">
      {({ push, remove }) => (
        <div className="space-y-6">
          {initialData.publications?.map((_, index) => (
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
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <Field
                  name={`publications.${index}.title`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <Field
                  name={`publications.${index}.description`}
                  as="textarea"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <FieldArray name={`publications.${index}.authors`}>
                {({ push: pushAuthor, remove: removeAuthor }) => (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Authors</label>
                    {initialData.publications?.[index].authors?.map((_, authorIndex) => (
                      <div key={authorIndex} className="flex gap-2">
                        <Field
                          name={`publications.${index}.authors.${authorIndex}`}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeAuthor(authorIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => pushAuthor('')}
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <FaPlus /> Add Author
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>
          ))}
          <button
            type="button"
            onClick={() => push({
              title: '',
              description: '',
              authors: []
            })}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Publication
          </button>
        </div>
      )}
    </FieldArray>
  );

  return (
    <Formik
      initialValues={initialData}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      <Form className="space-y-8">
        {activeTab === 'personal' && renderPersonalInfo()}
        {activeTab === 'summary' && renderSummary()}
        {activeTab === 'education' && renderEducation()}
        {activeTab === 'experience' && renderExperience()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'certifications' && renderCertifications()}
        {activeTab === 'skills' && renderSkills()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'languages' && renderLanguages()}
        {activeTab === 'publications' && renderPublications()}

        <div className="flex justify-end">
          <button
            type="submit"
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </Form>
    </Formik>
  );
}

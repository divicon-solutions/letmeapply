import { Field, useFormikContext } from 'formik';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';

interface SkillsSectionProps {
    values: any;
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    handleChange: (section: string, newData: unknown) => void;
    setFieldValue: (field: string, value: unknown) => void;
}

const SkillsSection = ({ values, dialogOpen, setDialogOpen, handleChange, setFieldValue }: SkillsSectionProps) => {
    const { values: formikValues, setFieldValue: formikSetFieldValue } = useFormikContext<any>();
    const deleteButtonClass = "flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors duration-150 p-1 rounded hover:bg-red-50";
    const deleteIconClass = "w-4 h-4";

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
                <button
                    type="button"
                    onClick={() => setDialogOpen(true)}
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
                        {Array.isArray(skills) && (skills as string[]).map((skill: string, skillIndex: number) => (
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
                                        newSkills[category] = (skills as string[]).filter((_, index) => index !== skillIndex);
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
                                    newSkills[category] = [...((skills as string[]) || []), skill];
                                    handleChange('skills', newSkills);
                                }
                            }}
                        >
                            <FaPlus className="w-3 h-3 mr-1" /> Add Skill
                        </button>
                    </div>
                </div>
            ))}

            {/* Skills Dialog */}
            {dialogOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black opacity-30"></div>
                        <div className="relative bg-white rounded-lg w-full max-w-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Add Skills Category</h3>
                                <button onClick={() => setDialogOpen(false)} className="text-gray-400 hover:text-gray-500">
                                    <FaTimes />
                                </button>
                            </div>
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
                                        const category = formikValues.newSkill?.category;
                                        const skillsInput = formikValues.newSkill?.skills;
                                        if (category && skillsInput) {
                                            const skillsList = skillsInput.split(',').map((skill: string) => skill.trim()).filter(Boolean);
                                            const newSkills = { ...formikValues.skills };
                                            newSkills[category] = skillsList;
                                            handleChange('skills', newSkills);
                                            setDialogOpen(false);
                                        }
                                    }}
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1"
                                    onClick={() => setDialogOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillsSection;

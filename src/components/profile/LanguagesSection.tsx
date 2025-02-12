import { Field, useFormikContext } from 'formik';
import { FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface LanguagesSectionProps {
    values: any;
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    handleFieldBlur: (fieldName: string, value: string | boolean, setFieldError: (field: string, message: string | undefined) => void) => void;
    handleChange: (section: string, newData: unknown) => void;
    setFieldValue: (field: string, value: unknown) => void;
    setFieldError: (field: string, message: string | undefined) => void;
}

const LanguagesSection = ({
    values,
    dialogOpen,
    setDialogOpen,
    handleFieldBlur,
    handleChange,
    setFieldValue,
    setFieldError
}: LanguagesSectionProps) => {
    const { values: formikValues, setFieldValue: formikSetFieldValue } = useFormikContext<any>();
    const deleteButtonClass = "flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors duration-150 p-1 rounded hover:bg-red-50";
    const deleteIconClass = "w-4 h-4";

    const resetNewLanguage = () => {
        formikSetFieldValue('newLanguage', {
            name: '',
            description: ''
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Languages</h2>
                <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => {
                        resetNewLanguage();
                        setDialogOpen(true);
                    }}
                >
                    <FaPlus className="mr-2" /> Add Language
                </button>
            </div>
            {values.languages.map((language: any, index: number) => (
                <div key={index} className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium">{language.name}</h3>
                        <button
                            type="button"
                            onClick={() => {
                                const newLanguages = [...values.languages];
                                newLanguages.splice(index, 1);
                                setFieldValue('languages', newLanguages);
                                handleChange('languages', newLanguages);
                            }}
                            className={deleteButtonClass}
                        >
                            <FaTrash className={deleteIconClass} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Language Name</label>
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

            {/* Languages Dialog */}
            {dialogOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black opacity-30"></div>
                        <div className="relative bg-white rounded-lg w-full max-w-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Add Language</h3>
                                <button onClick={() => {
                                    resetNewLanguage();
                                    setDialogOpen(false);
                                }} className="text-gray-400 hover:text-gray-500">
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Language Name</label>
                                    <Field
                                        type="text"
                                        name="newLanguage.name"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter language name"
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
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2"
                                    onClick={() => {
                                        const newLanguage = formikValues.newLanguage;
                                        if (!newLanguage?.name) {
                                            toast.error('Please enter a language name');
                                            return;
                                        }
                                        if (!newLanguage?.description) {
                                            toast.error('Please select a proficiency level');
                                            return;
                                        }
                                        handleChange('languages', [...(values.languages || []), newLanguage]);
                                        resetNewLanguage();
                                        setDialogOpen(false);
                                    }}
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1"
                                    onClick={() => {
                                        resetNewLanguage();
                                        setDialogOpen(false);
                                    }}
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

export default LanguagesSection;

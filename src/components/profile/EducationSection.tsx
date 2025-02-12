import { Field, useFormikContext } from 'formik';
import { FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { getDateFieldStyle, getDateErrorMessage } from './DateFieldHelper';
import { toast } from 'react-hot-toast';

interface EducationSectionProps {
    values: any;
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    handleFieldBlur: (fieldName: string, value: string | boolean, setFieldError: (field: string, message: string | undefined) => void) => void;
    handleChange: (section: string, newData: unknown) => void;
    setFieldValue: (field: string, value: unknown) => void;
    setFieldError: (field: string, message: string | undefined) => void;
}

const EducationSection = ({
    values,
    dialogOpen,
    setDialogOpen,
    handleFieldBlur,
    handleChange,
    setFieldValue,
    setFieldError
}: EducationSectionProps) => {
    const { values: formikValues, setFieldValue: formikSetFieldValue } = useFormikContext<any>();
    const deleteButtonClass = "flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors duration-150 p-1 rounded hover:bg-red-50";
    const deleteIconClass = "w-4 h-4";

    const formatDateToMonth = (dateString: string) => {
        if (!dateString) return '';
        return dateString.substring(0, 7); // Convert YYYY-MM-DD to YYYY-MM
    };

    const formatMonthToDate = (monthString: string) => {
        if (!monthString) return '';
        return `${monthString}-01`; // Convert YYYY-MM to YYYY-MM-DD
    };

    const resetNewEducation = () => {
        formikSetFieldValue('newEducation', {
            organization: '',
            accreditation: '',
            location: '',
            dates: {
                startDate: '',
                completionDate: '',
                isCurrent: false
            }
        });
    };

    const handleDateBlur = (fieldName: string, value: string) => {
        const fullDate = formatMonthToDate(value);
        handleFieldBlur(fieldName, fullDate, setFieldError);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => {
                        resetNewEducation();
                        setDialogOpen(true);
                    }}
                >
                    <FaPlus className="mr-2" /> Add Education
                </button>
            </div>
            {values?.education?.map((edu: any, index: number) => (
                <div key={index} className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium">{edu?.organization}</h3>
                        <button
                            type="button"
                            onClick={() => {
                                const newEducation = [...values.education];
                                newEducation.splice(index, 1);
                                setFieldValue('education', newEducation);
                                handleChange('education', newEducation);
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
                                type="month"
                                name={`education.${index}.dates.startDate`}
                                value={formatDateToMonth(edu.dates?.startDate)}
                                className={getDateFieldStyle(edu.dates, 'start')}
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                    handleDateBlur(`education.${index}.dates.startDate`, e.target.value);
                                }}
                            />
                            {getDateErrorMessage(edu.dates, 'start') && (
                                <p className="mt-1 text-sm text-red-600">{getDateErrorMessage(edu.dates, 'start')}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <Field
                                type="month"
                                name={`education.${index}.dates.completionDate`}
                                value={formatDateToMonth(edu.dates?.completionDate)}
                                disabled={values.education[index]?.dates?.isCurrent}
                                className={getDateFieldStyle(edu.dates, 'end')}
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                    handleDateBlur(`education.${index}.dates.completionDate`, e.target.value);
                                }}
                            />
                            {getDateErrorMessage(edu.dates, 'end') && (
                                <p className="mt-1 text-sm text-red-600">{getDateErrorMessage(edu.dates, 'end')}</p>
                            )}
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

            {/* Education Dialog */}
            {dialogOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black opacity-30"></div>
                        <div className="relative bg-white rounded-lg w-full max-w-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Add Education</h3>
                                <button onClick={() => {
                                    resetNewEducation();
                                    setDialogOpen(false);
                                }} className="text-gray-400 hover:text-gray-500">
                                    <FaTimes />
                                </button>
                            </div>
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
                                        type="month"
                                        name="newEducation.dates.startDate"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                            handleDateBlur('newEducation.dates.startDate', e.target.value);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                                    <Field
                                        type="month"
                                        name="newEducation.dates.completionDate"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                            handleDateBlur('newEducation.dates.completionDate', e.target.value);
                                        }}
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
                                        const newEducation = formikValues.newEducation;
                                        console.log('newEducation', newEducation);
                                        if (!newEducation?.organization) {
                                            toast.error('Please enter a school name');
                                            return;
                                        }
                                        handleChange('education', [...(values.education || []), newEducation]);
                                        resetNewEducation();
                                        setDialogOpen(false);
                                    }}
                                    className="flex-1 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1"
                                    onClick={() => {
                                        resetNewEducation();
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

export default EducationSection;

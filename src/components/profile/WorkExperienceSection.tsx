import { Field, useFormikContext } from 'formik';
import { FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { getDateFieldStyle, getDateErrorMessage } from './DateFieldHelper';
import { toast } from 'react-hot-toast';

interface WorkExperienceSectionProps {
    values: any;
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    handleFieldBlur: (fieldName: string, value: string | boolean, setFieldError: (field: string, message: string | undefined) => void) => void;
    handleChange: (section: string, newData: unknown) => void;
    setFieldValue: (field: string, value: unknown) => void;
    setFieldError: (field: string, message: string | undefined) => void;
}

const WorkExperienceSection = ({
    values,
    dialogOpen,
    setDialogOpen,
    handleFieldBlur,
    handleChange,
    setFieldValue,
    setFieldError
}: WorkExperienceSectionProps) => {
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

    const resetNewWorkExperience = () => {
        formikSetFieldValue('newWorkExperience', {
            organization: '',
            jobTitle: '',
            location: '',
            dates: {
                startDate: '',
                completionDate: '',
                isCurrent: false
            },
            bulletPoints: []
        });
    };

    const handleDateBlur = (fieldName: string, value: string) => {
        const fullDate = formatMonthToDate(value);
        handleFieldBlur(fieldName, fullDate, setFieldError);
        setFieldValue(fieldName, fullDate);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
                <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => {
                        resetNewWorkExperience();
                        setDialogOpen(true);
                    }}
                >
                    <FaPlus className="mr-2" /> Add Work Experience
                </button>
            </div>

            {values.workExperience.map((experience: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4 hover:border-gray-300 transition-colors duration-200">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium">{experience.jobTitle} at {experience.organization}</h3>
                        <button
                            type="button"
                            onClick={() => {
                                const newWorkExperience = [...values.workExperience];
                                newWorkExperience.splice(index, 1);
                                setFieldValue('workExperience', newWorkExperience);
                                handleChange('workExperience', newWorkExperience);
                            }}
                            className={deleteButtonClass}
                        >
                            <FaTrash className={deleteIconClass} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company Name</label>
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
                                <label className="block text-sm font-medium text-gray-700">Job Title</label>
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
                            <label className="block text-sm font-medium text-gray-700">Location</label>
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
                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                <Field
                                    type="month"
                                    name={`workExperience.${index}.dates.startDate`}
                                    value={formatDateToMonth(experience.dates?.startDate)}
                                    className={getDateFieldStyle(experience.dates, 'start')}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const fullDate = formatMonthToDate(e.target.value);
                                        setFieldValue(`workExperience.${index}.dates.startDate`, fullDate);
                                    }}
                                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                        handleDateBlur(`workExperience.${index}.dates.startDate`, e.target.value);
                                    }}
                                />
                                {getDateErrorMessage(experience.dates, 'start') && (
                                    <p className="mt-1 text-sm text-red-600">{getDateErrorMessage(experience.dates, 'start')}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Date</label>
                                <Field
                                    type="month"
                                    name={`workExperience.${index}.dates.completionDate`}
                                    value={formatDateToMonth(experience.dates?.completionDate)}
                                    disabled={values.workExperience[index]?.dates?.isCurrent}
                                    className={getDateFieldStyle(experience.dates, 'end')}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const fullDate = formatMonthToDate(e.target.value);
                                        setFieldValue(`workExperience.${index}.dates.completionDate`, fullDate);
                                    }}
                                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                        handleDateBlur(`workExperience.${index}.dates.completionDate`, e.target.value);
                                    }}
                                />
                                {getDateErrorMessage(experience.dates, 'end') && (
                                    <p className="mt-1 text-sm text-red-600">{getDateErrorMessage(experience.dates, 'end')}</p>
                                )}
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
                            <label className="ml-2 text-sm text-gray-900">Currently Working Here</label>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">Bullet Points</label>
                            <div className="space-y-3">
                                {values.workExperience[index].bulletPoints?.map((point: string, idx: number) => (
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

            {dialogOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black opacity-30"></div>
                        <div className="relative bg-white rounded-lg w-full max-w-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Add Work Experience</h3>
                                <button onClick={() => {
                                    resetNewWorkExperience();
                                    setDialogOpen(false);
                                }} className="text-gray-400 hover:text-gray-500">
                                    <FaTimes />
                                </button>
                            </div>
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
                                            type="month"
                                            name="newWorkExperience.dates.startDate"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const fullDate = formatMonthToDate(e.target.value);
                                                formikSetFieldValue('newWorkExperience.dates.startDate', fullDate);
                                            }}
                                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                                handleDateBlur('newWorkExperience.dates.startDate', e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                                        <Field
                                            type="month"
                                            name="newWorkExperience.dates.completionDate"
                                            disabled={formikValues.newWorkExperience?.dates?.isCurrent}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const fullDate = formatMonthToDate(e.target.value);
                                                formikSetFieldValue('newWorkExperience.dates.completionDate', fullDate);
                                            }}
                                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                                handleDateBlur('newWorkExperience.dates.completionDate', e.target.value);
                                            }}
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
                                        {formikValues.newWorkExperience?.bulletPoints?.map((point: string, idx: number) => (
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
                                                        const newPoints = [...(formikValues.newWorkExperience?.bulletPoints || [])];
                                                        newPoints.splice(idx, 1);
                                                        formikSetFieldValue('newWorkExperience.bulletPoints', newPoints);
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
                                                const currentPoints = formikValues.newWorkExperience?.bulletPoints || [];
                                                formikSetFieldValue('newWorkExperience.bulletPoints', [...currentPoints, '']);
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
                                        const newWorkExperience = formikValues.newWorkExperience;
                                        if (!newWorkExperience?.organization) {
                                            toast.error('Please enter a company name');
                                            return;
                                        }
                                        if (!newWorkExperience?.jobTitle) {
                                            toast.error('Please enter a job title');
                                            return;
                                        }
                                        handleChange('workExperience', [...(values.workExperience || []), newWorkExperience]);
                                        resetNewWorkExperience();
                                        setDialogOpen(false);
                                    }}
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1"
                                    onClick={() => {
                                        resetNewWorkExperience();
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

export default WorkExperienceSection;

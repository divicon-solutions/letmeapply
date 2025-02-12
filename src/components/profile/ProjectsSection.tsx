import { Field, useFormikContext } from 'formik';
import { FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { getDateFieldStyle, getDateErrorMessage } from './DateFieldHelper';
import { toast } from 'react-hot-toast';

interface ProjectsSectionProps {
    values: any;
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    handleFieldBlur: (fieldName: string, value: string | boolean, setFieldError: (field: string, message: string | undefined) => void) => void;
    handleChange: (section: string, newData: unknown) => void;
    setFieldValue: (field: string, value: unknown) => void;
    setFieldError: (field: string, message: string | undefined) => void;
}

const ProjectsSection = ({
    values,
    dialogOpen,
    setDialogOpen,
    handleFieldBlur,
    handleChange,
    setFieldValue,
    setFieldError
}: ProjectsSectionProps) => {
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

    const resetNewProject = () => {
        formikSetFieldValue('newProject', {
            projectName: '',
            organization: '',
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
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => {
                        resetNewProject();
                        setDialogOpen(true);
                    }}
                >
                    <FaPlus className="mr-2" /> Add Project
                </button>
            </div>
            {(values.projects || []).map((proj: any, index: number) => (
                <div key={index} className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium">{proj.projectName}</h3>
                        <button
                            type="button"
                            onClick={() => {
                                const newProjects = [...values.projects];
                                newProjects.splice(index, 1);
                                setFieldValue('projects', newProjects);
                                handleChange('projects', newProjects);
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
                                        className={getDateFieldStyle(proj.dates, 'start')}
                                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                            handleFieldBlur(`projects.${index}.dates.startDate`, e.target.value, setFieldError);
                                        }}
                                    />
                                    {getDateErrorMessage(proj.dates, 'start') && (
                                        <p className="mt-1 text-sm text-red-600">{getDateErrorMessage(proj.dates, 'start')}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Completion Date</label>
                                    <Field
                                        type="month"
                                        name={`projects.${index}.dates.completionDate`}
                                        disabled={proj.dates.isCurrent}
                                        className={getDateFieldStyle(proj.dates, 'end')}
                                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                            handleFieldBlur(`projects.${index}.dates.completionDate`, e.target.value, setFieldError);
                                        }}
                                    />
                                    {getDateErrorMessage(proj.dates, 'end') && (
                                        <p className="mt-1 text-sm text-red-600">{getDateErrorMessage(proj.dates, 'end')}</p>
                                    )}
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
                                {proj.bulletPoints?.map((point: string, idx: number) => (
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

            {/* Project Dialog */}
            {dialogOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black opacity-30"></div>
                        <div className="relative bg-white rounded-lg w-full max-w-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Add Project</h3>
                                <button onClick={() => {
                                    resetNewProject();
                                    setDialogOpen(false);
                                }} className="text-gray-400 hover:text-gray-500">
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Project Name</label>
                                    <Field
                                        type="text"
                                        name="newProject.projectName"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter project name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Organization</label>
                                    <Field
                                        type="text"
                                        name="newProject.organization"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter organization name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <Field
                                        type="text"
                                        name="newProject.location"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter location"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                        <Field
                                            type="month"
                                            name="newProject.dates.startDate"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                                handleDateBlur('newProject.dates.startDate', e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Completion Date</label>
                                        <Field
                                            type="month"
                                            name="newProject.dates.completionDate"
                                            disabled={formikValues.newProject?.dates?.isCurrent}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                                handleDateBlur('newProject.dates.completionDate', e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Field
                                        type="checkbox"
                                        name="newProject.dates.isCurrent"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">This is my current project</label>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Bullet Points</label>
                                    <div className="space-y-3">
                                        {formikValues.newProject?.bulletPoints?.map((point: string, idx: number) => (
                                            <div key={idx} className="flex items-start gap-2">
                                                <Field
                                                    as="textarea"
                                                    rows={2}
                                                    name={`newProject.bulletPoints.${idx}`}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm resize-y"
                                                    placeholder="Add project detail..."
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newPoints = [...(formikValues.newProject?.bulletPoints || [])];
                                                        newPoints.splice(idx, 1);
                                                        formikSetFieldValue('newProject.bulletPoints', newPoints);
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
                                                const currentPoints = formikValues.newProject?.bulletPoints || [];
                                                formikSetFieldValue('newProject.bulletPoints', [...currentPoints, '']);
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
                                        const newProject = formikValues.newProject;
                                        if (!newProject?.projectName) {
                                            toast.error('Please enter a project name');
                                            return;
                                        }
                                        handleChange('projects', [...(values.projects || []), newProject]);
                                        resetNewProject();
                                        setDialogOpen(false);
                                    }}
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1"
                                    onClick={() => {
                                        resetNewProject();
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

export default ProjectsSection;

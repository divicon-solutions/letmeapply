import { Field, useFormikContext } from 'formik';
import { FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface PublicationsSectionProps {
    values: any;
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    handleFieldBlur: (fieldName: string, value: string | boolean, setFieldError: (field: string, message: string | undefined) => void) => void;
    handleChange: (section: string, newData: unknown) => void;
    setFieldValue: (field: string, value: unknown) => void;
    setFieldError: (field: string, message: string | undefined) => void;
}

const PublicationsSection = ({
    values,
    dialogOpen,
    setDialogOpen,
    handleFieldBlur,
    handleChange,
    setFieldValue,
    setFieldError
}: PublicationsSectionProps) => {
    const { values: formikValues, setFieldValue: formikSetFieldValue } = useFormikContext<any>();
    const deleteButtonClass = "flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors duration-150 p-1 rounded hover:bg-red-50";
    const deleteIconClass = "w-4 h-4";

    const resetNewPublication = () => {
        formikSetFieldValue('newPublication', {
            title: '',
            description: '',
            authors: ''
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Publications</h2>
                <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => {
                        resetNewPublication();
                        setDialogOpen(true);
                    }}
                >
                    <FaPlus className="mr-2" /> Add Publication
                </button>
            </div>
            {values.publications.map((publication: any, index: number) => (
                <div key={index} className="border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium">{publication.title}</h3>
                        <button
                            type="button"
                            onClick={() => {
                                const newPublications = [...values.publications];
                                newPublications.splice(index, 1);
                                setFieldValue('publications', newPublications);
                                handleChange('publications', newPublications);
                            }}
                            className={deleteButtonClass}
                        >
                            <FaTrash className={deleteIconClass} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
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
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                                    handleFieldBlur(`publications.${index}.description`, e.target.value, setFieldError);
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Authors</label>
                            <Field
                                type="text"
                                name={`publications.${index}.authors`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                    handleFieldBlur(`publications.${index}.authors`, e.target.value, setFieldError);
                                }}
                            />
                        </div>
                    </div>
                </div>
            ))}

            {/* Publications Dialog */}
            {dialogOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black opacity-30"></div>
                        <div className="relative bg-white rounded-lg w-full max-w-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Add Publication</h3>
                                <button onClick={() => {
                                    resetNewPublication();
                                    setDialogOpen(false);
                                }} className="text-gray-400 hover:text-gray-500">
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                    <Field
                                        type="text"
                                        name="newPublication.title"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter publication title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <Field
                                        as="textarea"
                                        name="newPublication.description"
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter publication description"
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
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2"
                                    onClick={() => {
                                        const newPublication = formikValues.newPublication;
                                        if (!newPublication?.title) {
                                            toast.error('Please enter a publication title');
                                            return;
                                        }
                                        const publicationData = {
                                            title: newPublication.title || '',
                                            description: newPublication.description || '',
                                            authors: typeof newPublication.authors === 'string'
                                                ? newPublication.authors.split(',').map((author: string) => author.trim())
                                                : newPublication.authors || []
                                        };
                                        handleChange('publications', [...(values.publications || []), publicationData]);
                                        resetNewPublication();
                                        setDialogOpen(false);
                                    }}
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1"
                                    onClick={() => {
                                        resetNewPublication();
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

export default PublicationsSection;
import { Field } from 'formik';

interface PersonalInfoSectionProps {
    values: any;
    setFieldError: (field: string, message: string | undefined) => void;
    handleFieldBlur: (fieldName: string, value: string | boolean, setFieldError: (field: string, message: string | undefined) => void) => void;
}

const PersonalInfoSection = ({ values, setFieldError, handleFieldBlur }: PersonalInfoSectionProps) => {
    return (
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
};

export default PersonalInfoSection;

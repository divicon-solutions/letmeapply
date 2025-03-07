import React from 'react';
import { Field, useFormikContext } from 'formik';

interface SummaryProps {
  values: any;
  setFieldError: (field: string, message: string | undefined) => void;
  handleFieldBlur: (fieldName: string, value: string | boolean, setFieldError: (field: string, message: string | undefined) => void) => void;
  setFieldValue: (field: string, value: unknown) => void;
}

const Summary: React.FC<SummaryProps> = ({ values, setFieldError, handleFieldBlur, setFieldValue }) => {
  const { values: formikValues, setFieldValue: formikSetFieldValue } = useFormikContext<any>();

  const handleBlur = async (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    await handleFieldBlur('summary', value, setFieldError);
    formikSetFieldValue('summary', value);
    setFieldValue('summary', value);
  };

  React.useEffect(() => {
    if (values?.summary !== undefined) {
      formikSetFieldValue('summary', values.summary);
    }
  }, [values?.summary, formikSetFieldValue]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Summary</h2>
      <Field
        as="textarea"
        name="summary"
        rows={4}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Write a brief professional summary..."
        onBlur={handleBlur}
      />
    </div>
  );
};

export default Summary;

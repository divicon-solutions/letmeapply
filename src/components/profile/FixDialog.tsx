import { FaTimes } from 'react-icons/fa';

interface FixDialogProps {
    isOpen: boolean;
    onClose: () => void;
    invalidFields: { section: string; field: string; error: string }[];
}

const FixDialog = ({ isOpen, onClose, invalidFields }: FixDialogProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-black opacity-30"></div>
                <div className="relative bg-white rounded-lg w-full max-w-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Fields to Fix</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                            <FaTimes />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {invalidFields.map((field, index) => (
                            <div key={index} className="p-3 bg-red-50 rounded-md">
                                <h4 className="font-medium text-red-800">{field.section}</h4>
                                <p className="text-sm text-red-700">{field.field}: {field.error}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6">
                        <button
                            onClick={onClose}
                            className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FixDialog;

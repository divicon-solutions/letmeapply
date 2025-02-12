interface Dates {
    startDate?: string;
    completionDate?: string;
    isCurrent?: boolean;
}

export const getDateFieldStyle = (dates: Dates, fieldType: 'start' | 'end') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = dates.startDate ? new Date(dates.startDate) : null;
    const completionDate = dates.completionDate ? new Date(dates.completionDate) : null;

    const baseStyle = "mt-1 block w-full rounded-md shadow-sm";
    const validStyle = "border-gray-300 focus:border-blue-500 focus:ring-blue-500";
    const invalidStyle = "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500";
    const disabledStyle = dates.isCurrent ? " disabled:bg-gray-100 disabled:cursor-not-allowed" : "";

    if (fieldType === 'start') {
        if (!dates.startDate && !dates.isCurrent) {
            return `${baseStyle} ${invalidStyle}${disabledStyle}`;
        }
        if (startDate && startDate > today) {
            return `${baseStyle} ${invalidStyle}${disabledStyle}`;
        }
        if (startDate && completionDate && completionDate < startDate) {
            return `${baseStyle} ${invalidStyle}${disabledStyle}`;
        }
    }

    if (fieldType === 'end') {
        if (!dates.completionDate && !dates.isCurrent) {
            return `${baseStyle} ${invalidStyle}${disabledStyle}`;
        }
        if (completionDate && !dates.isCurrent && completionDate > today) {
            return `${baseStyle} ${invalidStyle}${disabledStyle}`;
        }
        if (startDate && completionDate && completionDate < startDate) {
            return `${baseStyle} ${invalidStyle}${disabledStyle}`;
        }
    }

    return `${baseStyle} ${validStyle}${disabledStyle}`;
};

export const getDateErrorMessage = (dates: Dates, fieldType: 'start' | 'end') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = dates.startDate ? new Date(dates.startDate) : null;
    const completionDate = dates.completionDate ? new Date(dates.completionDate) : null;

    if (fieldType === 'start') {
        if (!dates.startDate && !dates.isCurrent) {
            return "Start date is required";
        }
        if (startDate && startDate > today) {
            return "Start date cannot be in the future";
        }
    }

    if (fieldType === 'end') {
        if (!dates.completionDate && !dates.isCurrent) {
            return "End date is required";
        }
        if (completionDate && !dates.isCurrent && completionDate > today) {
            return "End date cannot be in the future";
        }
    }

    if (startDate && completionDate && completionDate < startDate) {
        if (fieldType === 'start') {
            return "Start date must be before end date";
        }
        if (fieldType === 'end') {
            return "End date must be after start date";
        }
    }

    return "";
};

export const getInvalidFields = (values: any) => {
    const invalidFields: { section: string; field: string; error: string }[] = [];

    const checkDates = (dates: Dates, section: string, index: number) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDate = dates.startDate ? new Date(dates.startDate) : null;
        const completionDate = dates.completionDate ? new Date(dates.completionDate) : null;

        if (!dates.startDate && !dates.isCurrent) {
            invalidFields.push({ section, field: `${index + 1} Start Date`, error: 'Start date is required' });
        }
        if (startDate && startDate > today) {
            invalidFields.push({ section, field: `${index + 1} Start Date`, error: 'Start date cannot be in the future' });
        }
        if (!dates.completionDate && !dates.isCurrent) {
            invalidFields.push({ section, field: `${index + 1} End Date`, error: 'End date is required' });
        }
        if (completionDate && !dates.isCurrent && completionDate > today) {
            invalidFields.push({ section, field: `${index + 1} End Date`, error: 'End date cannot be in the future' });
        }
        if (startDate && completionDate && completionDate < startDate) {
            invalidFields.push({ section, field: `${index + 1}`, error: 'End date must be after start date' });
        }
    };

    values.education?.forEach((edu: any, index: number) => {
        if (edu.dates) {
            checkDates(edu.dates, 'Education', index);
        }
    });

    values.workExperience?.forEach((work: any, index: number) => {
        if (work.dates) {
            checkDates(work.dates, 'Work Experience', index);
        }
    });

    values.projects?.forEach((project: any, index: number) => {
        if (project.dates) {
            checkDates(project.dates, 'Projects', index);
        }
    });

    return invalidFields;
};

export const hasInvalidDates = (values: any) => {
    const checkDates = (dates: Dates) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDate = dates.startDate ? new Date(dates.startDate) : null;
        const completionDate = dates.completionDate ? new Date(dates.completionDate) : null;

        const hasMissingDates = !dates.isCurrent && (!dates.startDate || !dates.completionDate);
        const hasFutureStartDate = startDate ? startDate > today : false;
        const hasFutureEndDate = completionDate && !dates.isCurrent ? completionDate > today : false;
        const hasInvalidDateRange = startDate && completionDate ? completionDate < startDate : false;

        return hasMissingDates || hasFutureStartDate || hasFutureEndDate || hasInvalidDateRange;
    };

    const hasInvalidEducationDates = values.education?.some((edu: any) => edu.dates && checkDates(edu.dates));
    const hasInvalidWorkDates = values.workExperience?.some((work: any) => work.dates && checkDates(work.dates));
    const hasInvalidProjectDates = values.projects?.some((project: any) => project.dates && checkDates(project.dates));

    return hasInvalidEducationDates || hasInvalidWorkDates || hasInvalidProjectDates;
};

export default {
    getDateFieldStyle,
    getDateErrorMessage,
    getInvalidFields,
    hasInvalidDates
};

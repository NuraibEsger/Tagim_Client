import toast from 'react-hot-toast';

export const handleApiError = (error: any, defaultMessage: string = 'Xəta baş verdi') => {
    const data = error?.response?.data;
    
    if (data?.errors?.length > 0) {
        // Validasiya xətasını göstər
        toast.error(data.errors[0].error);
    } else {
        // Ümumi xətanı göstər
        toast.error(data?.detail || defaultMessage);
    }
};
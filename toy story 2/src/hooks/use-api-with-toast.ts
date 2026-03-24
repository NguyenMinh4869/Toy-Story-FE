// hooks/use-toast-wrapper.ts
import { useToast } from "./useToast";
export const useToastWrapper = () => {
    const { toast } = useToast();

    const wrapApiCall = async <T>(
        apiCall: () => Promise<T>
    ): Promise<T> => {
        try {
            const result = await apiCall();

            // Try to get message from different possible structures
            let message: string | undefined;

            if (result && typeof result === 'object') {
                // Check for data.message structure
                if ('data' in result && result.data && typeof result.data === 'object' && 'message' in result.data) {
                    message = (result.data as any).message;
                }
                // Check for direct message property
                else if ('message' in result) {
                    message = (result as any).message;
                }
            }

            if (message) {
                toast({
                    description: message,
                    variant: "success",
                    duration: 3000,
                });
            }

            return result;
        } catch (error: any) {
            // Try to get error message from response
            let errorMsg = "Có lỗi xảy ra!";

            if (error?.response?.data) {
                // Check for data.message structure in error
                if (error.response.data.data?.message) {
                    errorMsg = error.response.data.data.message;
                }
                // Check for direct message
                else if (error.response.data.message) {
                    errorMsg = error.response.data.message;
                }
            }

            toast({
                description: errorMsg,
                variant: "destructive",
                duration: 3000,
            });

            throw error;
        }
    };

    return { wrapApiCall };
};
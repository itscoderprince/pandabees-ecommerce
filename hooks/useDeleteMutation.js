import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

/**
 * A reusable hook for handling record deletions (soft or permanent)
 * @param {Array} queryKey - The query key to invalidate on success
 * @param {string} deleteEndPoint - The API endpoint for the delete operation
 * @param {Object} options - Additional options including an optional onSuccess callback
 */
const useDeleteMutation = (queryKey, deleteEndPoint, options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ ids, deleteType }) => {
            const { data } = await axios({
                url: deleteEndPoint,
                method: deleteType === "PD" ? "DELETE" : "PUT",
                data: { ids: Array.isArray(ids) ? ids : [ids], deleteType },
            });
            return data;
        },
        onSuccess: (data, variables) => {
            const { deleteType } = variables;
            let message = "Operation successful";
            if (deleteType === "PD") message = "Permanently deleted";
            else if (deleteType === "SD") message = "Moved to trash";
            else if (deleteType === "RS") message = "Restored to main library";
            
            toast.success(message);
            
            // Invalidate the cache
            queryClient.invalidateQueries({ queryKey });

            // Call the custom onSuccess if provided
            if (options.onSuccess) {
                options.onSuccess(data, variables);
            }
        },
        onError: (error) => {
            console.error("Delete Mutation Error:", error);
            toast.error(error.response?.data?.message || "Operation failed. Please try again.");
        },
    });
};

export default useDeleteMutation;
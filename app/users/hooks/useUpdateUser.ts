import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUser } from "../service/user.service";
import { userKeys } from "../service/query-keys";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateUser(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });

      toast.success("User updated successfully");
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update user");
    },
  });
};

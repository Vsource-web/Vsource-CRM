import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { createUser } from "../service/user.service";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      toast.success("User created successfully");
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to create user");
    },
  });
};

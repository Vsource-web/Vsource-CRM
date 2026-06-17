"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { rbacApi } from "../api";

export function useUpdatePermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roleId,
      permissions,
    }: {
      roleId: string;
      permissions: any[];
    }) =>
      rbacApi.updatePermissions(roleId, {
        permissions,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });

      toast.success("Permissions updated successfully");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to update permissions",
      );
    },
  });
}

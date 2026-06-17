// rbac/usePermission.ts

import { useAuth } from "@/store";

export const usePermission = () => {
  const canRead = useAuth((s) => s.canRead);
  const canCreate = useAuth((s) => s.canCreate);
  const canUpdate = useAuth((s) => s.canUpdate);
  const canDelete = useAuth((s) => s.canDelete);

  return {
    canRead,
    canCreate,
    canUpdate,
    canDelete,
  };
};

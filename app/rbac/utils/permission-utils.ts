import { ModulePermission } from "../types";

export function normalizePermissions(permissions: ModulePermission[]) {
  return [...permissions]
    .sort((a, b) => a.moduleId.localeCompare(b.moduleId))
    .map((permission) => ({
      moduleId: permission.moduleId,

      canCreate: permission.canCreate,

      canRead: permission.canRead,

      canUpdate: permission.canUpdate,

      canDelete: permission.canDelete,
    }));
}

export function permissionsChanged(
  original: ModulePermission[],
  current: ModulePermission[],
) {
  return (
    JSON.stringify(normalizePermissions(original)) !==
    JSON.stringify(normalizePermissions(current))
  );
}

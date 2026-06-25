import db from "../lib/prisma";

const PERFORMANCE_MODULE = {
  name: "Performances",
  code: "performances",
  icon: "ChartNoAxesCombined",
  sortOrder: 35,
  isActive: true,
};

const REPORT_ALLOWED_ROLES = new Set([
  "super admin",
  "director",
  "branch manager",
  "counsellor",
  "counselor",

  "jr associate",
  "jr associate backend",
  "jr associate fintech",

  "sr associate",
  "sr associate backend",
  "sr associate fintech",
]);

const REPORT_DENIED_ROLES = new Set([
  "receptionist",
]);

function normalizeRoleName(
  value: string | null | undefined,
): string {
  return (
    value
      ?.trim()
      .toLowerCase()
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ") ?? ""
  );
}

async function main(): Promise<void> {
  console.log(
    "[performance-permissions] Synchronisation started",
  );

  const performanceModule = await db.module.upsert({
    where: {
      code: PERFORMANCE_MODULE.code,
    },

    create: {
      name: PERFORMANCE_MODULE.name,
      code: PERFORMANCE_MODULE.code,
      icon: PERFORMANCE_MODULE.icon,
      sortOrder: PERFORMANCE_MODULE.sortOrder,
      isActive: PERFORMANCE_MODULE.isActive,
    },

    update: {
      name: PERFORMANCE_MODULE.name,
      icon: PERFORMANCE_MODULE.icon,
      sortOrder: PERFORMANCE_MODULE.sortOrder,
      isActive: PERFORMANCE_MODULE.isActive,
    },

    select: {
      id: true,
      name: true,
      code: true,
    },
  });

  const roles = await db.role.findMany({
    select: {
      id: true,
      name: true,
    },

    orderBy: {
      name: "asc",
    },
  });

  if (roles.length === 0) {
    console.warn(
      "[performance-permissions] No roles were found.",
    );

    return;
  }

  const permissionResults = roles.map((role) => {
    const normalizedRoleName = normalizeRoleName(
      role.name,
    );

    const explicitlyDenied =
      REPORT_DENIED_ROLES.has(normalizedRoleName);

    const canRead =
      REPORT_ALLOWED_ROLES.has(normalizedRoleName) &&
      !explicitlyDenied;

    return {
      role,
      normalizedRoleName,
      canRead,
    };
  });

  await db.$transaction(
    permissionResults.map(({ role, canRead }) =>
      db.roleModulePermission.upsert({
        where: {
          roleId_moduleId: {
            roleId: role.id,
            moduleId: performanceModule.id,
          },
        },

        create: {
          roleId: role.id,
          moduleId: performanceModule.id,

          canCreate: false,
          canRead,
          canUpdate: false,
          canDelete: false,
        },

        update: {
          canCreate: false,
          canRead,
          canUpdate: false,
          canDelete: false,
        },
      }),
    ),
  );

  console.table(
    permissionResults.map(
      ({
        role,
        normalizedRoleName,
        canRead,
      }) => ({
        role: role.name,
        normalizedRoleName,
        performanceReadAccess: canRead
          ? "ALLOWED"
          : "DENIED",
      }),
    ),
  );

  console.log(
    `[performance-permissions] Module "${performanceModule.code}" synchronised successfully.`,
  );
}

main()
  .catch((error) => {
    console.error(
      "[performance-permissions] Synchronisation failed",
      error,
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
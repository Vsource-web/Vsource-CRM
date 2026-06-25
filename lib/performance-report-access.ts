import type { NextRequest } from "next/server";
import type { Prisma } from "@/generated/prisma/client";

import {
  MODULES,
  PERMISSIONS,
} from "@/lib/module-codes";
import { getAuthorizedUser } from "@/lib/rbac";

import type {
  PerformanceReportAccessInfo,
  PerformanceReportAccessMode,
} from "@/types/performance-report";

const GLOBAL_ROLES = new Set([
  "super admin",
  "director",
]);

const BRANCH_ROLES = new Set([
  "branch manager",
]);

const COUNSELLOR_ROLES = new Set([
  "counsellor",
  "counselor",
]);

const ASSOCIATE_ROLES = new Set([
  "jr associate",
  "jr associate backend",
  "jr associate fintech",

  "sr associate",
  "sr associate backend",
  "sr associate fintech",
]);

const DENIED_ROLES = new Set([
  "receptionist",
]);

export type PerformanceReportAccessContext =
  PerformanceReportAccessInfo & {
    assignedBranchIds: string[];
  };

export type PerformanceReportAccessResult =
  | {
      allowed: true;
      access: PerformanceReportAccessContext;
    }
  | {
      allowed: false;
      status: 403;
      message: string;
    };

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

function unique(values: string[]): string[] {
  return Array.from(
    new Set(values.filter(Boolean)),
  );
}

function getAccessMode(
  normalizedRoleName: string,
): PerformanceReportAccessMode | null {
  if (GLOBAL_ROLES.has(normalizedRoleName)) {
    return "global";
  }

  if (BRANCH_ROLES.has(normalizedRoleName)) {
    return "branch";
  }

  if (COUNSELLOR_ROLES.has(normalizedRoleName)) {
    return "counsellor";
  }

  if (ASSOCIATE_ROLES.has(normalizedRoleName)) {
    return "associate";
  }

  return null;
}

function getScopeLabel(
  mode: PerformanceReportAccessMode,
): string {
  switch (mode) {
    case "global":
      return "All branches";

    case "branch":
      return "Assigned branches";

    case "counsellor":
      return "My assigned, created and converted records";

    case "associate":
      return "Assigned branches and directly handled records";
  }
}

export async function resolvePerformanceReportAccess(
  req: NextRequest,
): Promise<PerformanceReportAccessResult> {
  /*
   * This validates both authentication and the dedicated
   * performances module read permission.
   *
   * The database must contain:
   * Module.code = "performances"
   * RoleModulePermission.canRead = true
   */
  const currentUser = await getAuthorizedUser(
    req,
    MODULES.PERFORMANCES,
    PERMISSIONS.READ,
  );

  const normalizedRoleName = normalizeRoleName(
    currentUser.role?.name,
  );

  if (DENIED_ROLES.has(normalizedRoleName)) {
    return {
      allowed: false,
      status: 403,
      message:
        "Receptionist users are not permitted to view performance reports.",
    };
  }

  const mode = getAccessMode(normalizedRoleName);

  if (!mode) {
    return {
      allowed: false,
      status: 403,
      message: `The role "${
        currentUser.role?.name ?? "Unknown"
      }" is not configured for performance-report access.`,
    };
  }

  const assignedBranchIds = unique(
    (currentUser.branches ?? []).map(
      (branch: { id: string }) => branch.id,
    ),
  );

  return {
    allowed: true,

    access: {
      userId: currentUser.id,
      userName: currentUser.name,
      roleName: currentUser.role.name,

      mode,

      assignedBranchIds,
      branchIds: assignedBranchIds,

      scopeLabel: getScopeLabel(mode),

      canExport: true,

      canFilterBranches:
        mode === "global" ||
        mode === "branch" ||
        mode === "associate",

      canFilterCounsellors:
        mode === "global" ||
        mode === "branch" ||
        mode === "associate",

      canFilterFintechAssignees:
        mode !== "counsellor",
    },
  };
}

function getEmptyLeadWhere(): Prisma.LeadWhereInput {
  return {
    id: {
      in: [],
    },
  };
}

function getEmptyStudentWhere(): Prisma.StudentWhereInput {
  return {
    id: {
      in: [],
    },
  };
}

function assignedBranchLeadClause(
  access: PerformanceReportAccessContext,
): Prisma.LeadWhereInput | null {
  if (access.assignedBranchIds.length === 0) {
    return null;
  }

  return {
    branchId: {
      in: access.assignedBranchIds,
    },
  };
}

function assignedBranchStudentClause(
  access: PerformanceReportAccessContext,
): Prisma.StudentWhereInput | null {
  if (access.assignedBranchIds.length === 0) {
    return null;
  }

  return {
    branchId: {
      in: access.assignedBranchIds,
    },
  };
}

/**
 * Super Admin / Director:
 * All leads.
 *
 * Branch Manager:
 * All leads from assigned branches.
 *
 * Counsellor:
 * Unconverted leads in assigned branches where the user
 * created the lead or received a LeadCounselor assignment.
 *
 * Associates:
 * Leads from assigned branches OR created by the user OR
 * converted by the user.
 */
export function buildPerformanceLeadAccessWhere(
  access: PerformanceReportAccessContext,
): Prisma.LeadWhereInput {
  if (access.mode === "global") {
    return {};
  }

  const branchClause =
    assignedBranchLeadClause(access);

  if (access.mode === "branch") {
    return branchClause ?? getEmptyLeadWhere();
  }

  if (access.mode === "counsellor") {
    if (!branchClause) {
      return getEmptyLeadWhere();
    }

    return {
      AND: [
        branchClause,

        {
          OR: [
            {
              createdById: access.userId,
            },

            {
              counselors: {
                some: {
                  counselorId: access.userId,
                },
              },
            },
          ],
        },
      ],
    };
  }

  const associateConditions: Prisma.LeadWhereInput[] =
    [
      {
        createdById: access.userId,
      },

      {
        convertedById: access.userId,
      },
    ];

  if (branchClause) {
    associateConditions.unshift(branchClause);
  }

  return {
    OR: associateConditions,
  };
}

/**
 * Super Admin / Director:
 * All converted students.
 *
 * Branch Manager:
 * All students from assigned branches.
 *
 * Counsellor:
 * Only students whose lead was converted by the current
 * counsellor. Creating or receiving the lead does not give
 * access after another person converted it.
 *
 * Associates:
 * Students from assigned branches OR whose lead was created
 * by them OR converted by them OR assigned to them as the
 * fintech assignee.
 */
export function buildPerformanceStudentAccessWhere(
  access: PerformanceReportAccessContext,
): Prisma.StudentWhereInput {
  if (access.mode === "global") {
    return {};
  }

  const branchClause =
    assignedBranchStudentClause(access);

  if (access.mode === "branch") {
    return branchClause ?? getEmptyStudentWhere();
  }

  if (access.mode === "counsellor") {
    if (!branchClause) {
      return getEmptyStudentWhere();
    }

    return {
      AND: [
        branchClause,

        {
          lead: {
            is: {
              convertedById: access.userId,
            },
          },
        },
      ],
    };
  }

  const associateConditions: Prisma.StudentWhereInput[] =
    [
      {
        lead: {
          is: {
            createdById: access.userId,
          },
        },
      },

      {
        lead: {
          is: {
            convertedById: access.userId,
          },
        },
      },

      {
        visaLoanProfile: {
          is: {
            fintechAssigneeId: access.userId,
          },
        },
      },
    ];

  if (branchClause) {
    associateConditions.unshift(branchClause);
  }

  return {
    OR: associateConditions,
  };
}

export function applyAccessibleBranchIds(
  access: PerformanceReportAccessContext,
  branchIds: string[],
): PerformanceReportAccessInfo {
  const accessibleBranchIds = unique(branchIds);

  return {
    userId: access.userId,
    userName: access.userName,
    roleName: access.roleName,

    mode: access.mode,

    branchIds: accessibleBranchIds,

    scopeLabel: access.scopeLabel,

    canExport: access.canExport,

    canFilterBranches:
      access.mode !== "counsellor" &&
      accessibleBranchIds.length > 1,

    canFilterCounsellors:
      access.canFilterCounsellors,

    canFilterFintechAssignees:
      access.canFilterFintechAssignees,
  };
}

/**
 * Counsellors must not be able to manually submit another
 * counsellor or fintech user ID through URL parameters.
 */
export function constrainPerformanceReportFilters<
  T extends {
    branchId: string;
    counselorId: string;
    fintechAssigneeId: string;
  },
>(
  filters: T,
  access: PerformanceReportAccessContext,
): T {
  if (access.mode !== "counsellor") {
    return filters;
  }

  return {
    ...filters,

    counselorId: "",
    fintechAssigneeId: "",
  };
}
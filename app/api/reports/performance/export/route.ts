import {
  NextRequest,
  NextResponse,
} from "next/server";

import { handleError } from "@/lib/api-helpers";
import db from "@/lib/prisma";

import {
  constrainPerformanceReportFilters,
  resolvePerformanceReportAccess,
} from "@/lib/performance-report-access";

import {
  buildPerformanceReportWorkbook,
} from "@/lib/performance-report-excel";

import {
  getPerformanceReportForExport,
  parsePerformanceReportFilters,
} from "@/lib/performance-reports";

import type {
  PerformanceReportFilters,
} from "@/types/performance-report";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Database IDs must be used while querying.
 *
 * This helper creates a second filters object used only for the
 * Excel Applied Filters sheet. ID values are replaced with names.
 */
async function resolveExportFilterLabels(
  filters: PerformanceReportFilters,
): Promise<PerformanceReportFilters> {
  const [
    branch,
    counselor,
    country,
    intake,
    university,
    fintechAssignee,
  ] = await Promise.all([
    filters.branchId
      ? db.branch.findUnique({
          where: {
            id: filters.branchId,
          },
          select: {
            name: true,
          },
        })
      : Promise.resolve(null),

    filters.counselorId
      ? db.user.findUnique({
          where: {
            id: filters.counselorId,
          },
          select: {
            name: true,
          },
        })
      : Promise.resolve(null),

    filters.countryId
      ? db.country.findUnique({
          where: {
            id: filters.countryId,
          },
          select: {
            name: true,
          },
        })
      : Promise.resolve(null),

    filters.intakeId
      ? db.intake.findUnique({
          where: {
            id: filters.intakeId,
          },
          select: {
            name: true,
          },
        })
      : Promise.resolve(null),

    filters.universityId
      ? db.university.findUnique({
          where: {
            id: filters.universityId,
          },
          select: {
            name: true,
          },
        })
      : Promise.resolve(null),

    filters.fintechAssigneeId
      ? db.user.findUnique({
          where: {
            id: filters.fintechAssigneeId,
          },
          select: {
            name: true,
          },
        })
      : Promise.resolve(null),
  ]);

  return {
    ...filters,

    branchId:
      branch?.name ??
      filters.branchId,

    counselorId:
      counselor?.name ??
      filters.counselorId,

    countryId:
      country?.name ??
      filters.countryId,

    intakeId:
      intake?.name ??
      filters.intakeId,

    universityId:
      university?.name ??
      filters.universityId,

    fintechAssigneeId:
      fintechAssignee?.name ??
      filters.fintechAssigneeId,
  };
}

export async function GET(req: NextRequest) {
  try {
    const accessResult =
      await resolvePerformanceReportAccess(req);

    if (!accessResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: accessResult.message,
        },
        {
          status: accessResult.status,
        },
      );
    }

    if (!accessResult.access.canExport) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message:
            "You are not allowed to export performance reports.",
        },
        {
          status: 403,
        },
      );
    }

    const requestedFilters =
      parsePerformanceReportFilters(
        req.nextUrl.searchParams,
      );

    const filters =
      constrainPerformanceReportFilters(
        requestedFilters,
        accessResult.access,
      );

    /*
     * Query using actual database IDs.
     */
    const report =
      await getPerformanceReportForExport(
        filters,
        accessResult.access,
      );

    /*
     * Convert IDs to readable labels only for Excel.
     */
    const excelDisplayFilters =
      await resolveExportFilterLabels(filters);

    const workbook =
      await buildPerformanceReportWorkbook(
        report,
        excelDisplayFilters,
      );

    const date = new Date()
      .toISOString()
      .slice(0, 10);

    return new Response(workbook as unknown as BodyInit, {
      status: 200,

      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "Content-Disposition":
          `attachment; filename="vsource-performance-report-${date}.xlsx"`,

        "Cache-Control":
          "no-store, no-cache, must-revalidate",

        Pragma: "no-cache",

        Expires: "0",
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
import { NextRequest, NextResponse } from "next/server";
import { handleError, ok } from "@/lib/api-helpers";
import {
  constrainPerformanceReportFilters,
  resolvePerformanceReportAccess,
} from "@/lib/performance-report-access";
import {
  getPerformanceReport,
  parsePerformanceReportFilters,
  parsePerformanceReportPagination,
} from "@/lib/performance-reports";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const accessResult = await resolvePerformanceReportAccess(req);

    if (!accessResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: accessResult.message,
        },
        { status: accessResult.status },
      );
    }

    const requestedFilters = parsePerformanceReportFilters(
      req.nextUrl.searchParams,
    );
    const filters = constrainPerformanceReportFilters(
      requestedFilters,
      accessResult.access,
    );
    const { page, limit } = parsePerformanceReportPagination(
      req.nextUrl.searchParams,
    );

    const report = await getPerformanceReport(
      filters,
      page,
      limit,
      accessResult.access,
    );

    return ok(report, "Performance report fetched successfully");
  } catch (error) {
    return handleError(error);
  }
}

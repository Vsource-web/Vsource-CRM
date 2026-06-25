import { NextRequest, NextResponse } from "next/server";
import { handleError, ok } from "@/lib/api-helpers";
import { resolvePerformanceReportAccess } from "@/lib/performance-report-access";
import { getPerformanceReportFilterOptions } from "@/lib/performance-reports";

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

    const options = await getPerformanceReportFilterOptions(
      accessResult.access,
    );

    return ok(options, "Performance report filters fetched successfully");
  } catch (error) {
    return handleError(error);
  }
}

import type {
  ApiResponse,
  PerformanceReportData,
  PerformanceReportFilters,
  PerformanceReportFilterOptions,
} from "@/types/performance-report";

function buildQueryString(
  filters: PerformanceReportFilters,
  pagination?: {
    page: number;
    limit: number;
  },
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  if (pagination) {
    searchParams.set("page", String(pagination.page));
    searchParams.set("limit", String(pagination.limit));
  }

  return searchParams.toString();
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const responseText = await response.text();
    const preview = responseText
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 180);

    throw new Error(
      response.ok
        ? "The server returned a non-JSON response."
        : preview || `Request failed with status ${response.status}`,
    );
  }

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(
      payload.message || `Request failed with status ${response.status}`,
    );
  }

  return payload.data;
}

export async function getPerformanceReport(
  filters: PerformanceReportFilters,
  page: number,
  limit: number,
): Promise<PerformanceReportData> {
  const queryString = buildQueryString(filters, {
    page,
    limit,
  });

  const response = await fetch(`/api/reports/performance?${queryString}`, {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<PerformanceReportData>(response);
}

export async function getPerformanceReportFilterOptions(): Promise<PerformanceReportFilterOptions> {
  const response = await fetch("/api/reports/filters", {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<PerformanceReportFilterOptions>(response);
}

export async function exportPerformanceReport(
  filters: PerformanceReportFilters,
): Promise<Blob> {
  const queryString = buildQueryString(filters);
  const response = await fetch(
    `/api/reports/performance/export?${queryString}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    let message = "Unable to export performance report";

    try {
      const payload = (await response.json()) as {
        message?: string;
      };

      message = payload.message || message;
    } catch {
      message = "Unable to export performance report";
    }

    throw new Error(message);
  }

  return response.blob();
}

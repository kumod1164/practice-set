import { NextRequest } from "next/server";
import { requireAuthAPI } from "@/lib/session";
import { analyticsService } from "@/lib/services/analytics-service";
import { handleAPIError } from "@/lib/errors";

/**
 * GET /api/dashboard/charts
 * Get chart data for visualizations
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuthAPI();

    const progressData = await analyticsService.getProgressChartData(session.user.id, 10);

    return Response.json({
      success: true,
      data: progressData,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

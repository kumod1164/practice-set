import { NextRequest } from "next/server";
import { requireAuthAPI } from "@/lib/session";
import { analyticsService } from "@/lib/services/analytics-service";
import { handleAPIError } from "@/lib/errors";

/**
 * GET /api/dashboard/stats
 * Get overall user statistics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuthAPI();

    const stats = await analyticsService.getUserStats(session.user.id);
    const topicStrength = await analyticsService.getTopicWiseStrength(session.user.id);
    const streak = await analyticsService.getDailyStreak(session.user.id);

    return Response.json({
      success: true,
      data: {
        ...stats,
        topicStrength,
        streak,
      },
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

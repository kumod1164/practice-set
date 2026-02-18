import { NextRequest } from "next/server";
import { requireAuthAPI } from "@/lib/session";
import { questionService } from "@/lib/services/question-service";
import { handleAPIError } from "@/lib/errors";

/**
 * GET /api/tests/topics
 * Get available topics and subtopics from database
 */
export async function GET(request: NextRequest) {
  try {
    await requireAuthAPI();

    // Get all unique topics and subtopics
    const topics = await questionService.getAvailableTopics();

    return Response.json({
      success: true,
      data: topics,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}

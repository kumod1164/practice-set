import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/admin";
import { topicService } from "@/lib/services/topic-service";
import { handleAPIError } from "@/lib/errors";

/**
 * POST /api/admin/topics/sync
 * Sync topics from existing questions
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();

    const result = await topicService.syncTopicsFromQuestions();

    return Response.json({
      success: true,
      data: result,
      message: `Sync completed. Created ${result.created} new topics, updated ${result.updated} existing topics.`,
    });
  } catch (error) {
    return handleAPIError(error);
  }
}
